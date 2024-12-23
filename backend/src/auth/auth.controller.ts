import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, LoginResponse } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Login user' })
  @ApiOkResponse({
    description: 'The users logged in successfully.',
    type: LoginResponse,
  })
  @ApiBody({
    description: 'Credentials of user',
    type: LoginDto,
  })
  @Post('login')
  async login(@Body() loginCreds: any) {
    console.log('usercreds', loginCreds)
    return this.authService.login(loginCreds);
  }
}
