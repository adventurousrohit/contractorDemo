import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContractModule } from './contract/contract.module';

@Module({
  imports: [ AuthModule, PrismaModule, JwtModule.register({ secret: process.env.JWT_SECRET }), ContractModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
