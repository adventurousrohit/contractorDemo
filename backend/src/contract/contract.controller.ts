import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Request,
  Get,
  Query,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiConsumes,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Role } from '.prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContractService } from './contract.service';
import * as path from 'path';
import { FileDto } from './dto/file.dto';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractorService: ContractService) {}

  // Route to handle the file upload and process the buffer
  @Post('upload/contract')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Roles(Role.User)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload JSON or text file for processing',
    type: FileDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const user = req?.user;

    if (fileExtension === '.json') {
      const message = await this.contractorService.processContractorsFromJSON(
        file.buffer,
        user,
      );
      return { message };
    } else if (fileExtension === '.txt' || fileExtension === '.csv') {
      const message = await this.contractorService.processContractorsFromText(
        file.buffer,
        user,
      );
      return { message };
    } else {
      throw new HttpException(
        'Invalid file format. Only JSON and CSV files are allowed.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Route to handle the file upload and process the buffer
  @Get('get/contract')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Roles(Role.User, Role.Admin)
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Contract data for this userId',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter contracts by status (e.g., "pending", "approved")',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page number for pagination (default is 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description:
      'The number of records per page for pagination (default is 10)',
    type: Number,
  })
  async getContract(
    @Request() req: any,
    @Query('userId') userId?: number,
    @Query('status') status?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    page = isNaN(page) || page <= 0 ? 1 : page;
    pageSize = isNaN(pageSize) || pageSize <= 0 ? 10 : pageSize;
    const id = isNaN(userId) ? req?.user?.id : userId;
    return this.contractorService.getUserContracts(id, status, page, pageSize);
  }

  // Route to handle the file upload and process the buffer
  @Get('get/all/user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Roles(Role.Admin)
  async getUser(@Request() req: any) {
    return this.contractorService.getAllUsers();
  }

  @Delete('delete/contract/:contractId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Roles(Role.User, Role.Admin)
  @ApiParam({
    name: 'contractId',
    required: true,
    description: 'The contract ID to delete',
  })
  async deleteContract(
    @Request() req: any,
    @Param('contractId') contractId: number,
  ) {
    const user = req.user;
    return this.contractorService.deleteContract(user, contractId);
  }

  @Put('update/status/:contractId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Roles(Role.Admin)
  @ApiParam({
    name: 'contractId',
    required: true,
    description: 'The contract ID to delete',
  })
  @ApiQuery({
    name: 'isApproved',
    required: false,
    description: 'The page number for pagination (default is 1)',
    type: Boolean,
  })
  async updateStatus(
    @Request() req: any,
    @Param('contractId') contractId: number,
    @Query('isApproved') isApproved: Boolean,
  ) {
    // const user = req.user
    return this.contractorService.approveContract(contractId, isApproved);
  }
}
