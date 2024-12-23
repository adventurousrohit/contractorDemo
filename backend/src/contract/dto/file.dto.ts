import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsBoolean } from 'class-validator';

export class FileDto {
    @ApiProperty({
      description: 'Upload JSON or text file for processing',
      type: 'string',
      format: 'binary',
    })
    @IsOptional()
    file: Express.Multer.File;
  }

  export class Approved {
    @ApiProperty({
      description: 'Approval status of the contract. Can be either true or false.',
      type: Boolean,
      default: false,  
    })
    @IsBoolean()
    isApproved: boolean;
  }