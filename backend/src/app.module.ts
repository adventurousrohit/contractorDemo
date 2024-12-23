import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContractModule } from './contract/contract.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ AuthModule, PrismaModule, JwtModule.register({ secret: process.env.JWT_SECRET || 'S3CR3TK3Y' }), ContractModule,  ConfigModule.forRoot({
    isGlobal: true,  // This makes the config available throughout the app
  }),],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
