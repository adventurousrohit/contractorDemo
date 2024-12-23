import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express'
import * as multer from 'multer';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import  {PrismaService} from 'prisma/prisma.service'

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(), // This stores the file in memory (Buffer)
    }),
  ],
  controllers: [ContractController],
  providers: [ContractService, PrismaService]
})
export class ContractModule {}
