import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}


  async validateUser(payload:any): Promise<User> {
    try {
      const {email} =  payload
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          roles: true, 
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error validating user: ${error.message}`);
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          roles: true, 
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.roles || user.roles.length === 0) {
        throw new UnauthorizedException('User does not have assigned roles');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.roles?.map((data)=>data?.name),
      };

      const token = this.jwtService.sign(payload);

      return { access_token: token, user:user };

    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred during login');
    }
  }
}
