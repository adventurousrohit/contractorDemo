import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as csv from 'csv-parser';
import * as JSON5 from 'json5'; // Optional: If you want to handle JSON5 as well
import { Readable } from 'stream';
import { Contract } from '@prisma/client';

@Injectable()
export class ContractService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to process the uploaded JSON file directly from the buffer
  async processContractorsFromJSON(buffer: Buffer, user: any) {
    const contractors = this.parseJSON(buffer, user);
    const contractorData = contractors.map((contractor: any) => ({
      userId: user?.id,
      title: contractor.title ?? '',
      contractorName:contractor?.contractorName ?? '',
      isApproved: false,
      status:'pending',
      startDate: new Date(contractor?.startDate),
      endDate: new Date(contractor?.endDate ?? null),
    }));

    await this.prisma.contract.createMany({
      data: contractorData,
    });

    return 'Contractors inserted successfully';
  }

  // Method to process the uploaded CSV (Text) file directly from the buffer
  async processContractorsFromText(buffer: Buffer, user: any) {
    const contractors = await this.parseCSV(buffer, user);
    await this.prisma.contract.createMany({
      data: contractors,
    });
    return 'Contractors inserted successfully';
  }

  // Helper method to parse JSON data from buffer
  private parseJSON(buffer: Buffer, user: any): any[] {
    const data = buffer.toString('utf-8');
    try {
      return JSON5.parse(data); // You can use JSON.parse() if you want standard JSON handling
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }

  // Helper method to parse CSV data from buffer
  private async parseCSV(buffer: Buffer, user: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const contractors: any[] = [];
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      readableStream
        .pipe(csv())
        .on('data', (row) => {
          contractors.push({
            name: row.name,
            email: row.email,
            phone: row.phone,
            address: row.address,
          });
        })
        .on('end', () => resolve(contractors))
        .on('error', (error) => reject(error));
    });
  }


  async getUserContracts(userId: number, status?: string, page: number = 1, pageSize: number = 10) {
    try {
      const skip = (page - 1) * pageSize; 
      const take = pageSize; 

      const contracts = await this.prisma.contract.findMany({
        where: {
          userId: userId, 
          ...(status && { status }),
        },
        include: {
          user: true,  
        },
        skip,  
        take, 
      });
  
      const totalContracts = await this.prisma.contract.count({
        where: {
          userId: userId,
          ...(status && { status }),
        },
      });
  
      const totalPages = Math.ceil(totalContracts / pageSize);
  
      return {
        contracts,
        pagination: {
          currentPage: page,
          totalPages,
          totalContracts,
          pageSize,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch contracts for user ${userId}: ${error.message}`);
    }
  }

  async deleteContract(user: any, contractId: number) {
    try {
      const contract = await this.prisma.contract.findUnique({
        where: { id: contractId },
      });
      if (!contract) {
        throw new NotFoundException('Contract not found');
      }

      if (contract.userId !== user.id && user?.role != 'Admin') {
        throw new ForbiddenException('You do not have permission to delete this contract');
      }

      await this.prisma.contract.delete({
        where: { id: contractId },
      });

      return { message: 'Contract deleted successfully' };
    } catch (error) {
      throw error; 
    }
  }

  async approveContract(contractId: number, isApproved: any): Promise<Contract> {
    try {
      console.log("checking contr", contractId, isApproved)
      const contract = await this.prisma.contract.findUnique({
        where: { id: contractId },
      });

      if (!contract) {
        throw new NotFoundException(`Contract with id ${contractId} not found`);
      }

      const updatedContract = await this.prisma.contract.update({
        where: { id: contractId },
        data: {
          status: isApproved ? 'approved' : 'rejected', 
          isApproved: isApproved,  
        },
      });

      return updatedContract;

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error; 
      }

      throw new InternalServerErrorException(`An error occurred while processing the contract approval: ${error.message}`);
    }
  }

}
