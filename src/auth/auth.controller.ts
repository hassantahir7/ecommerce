import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LogInDto } from './dto/login.dto';
import { AuthEndpoints } from 'src/common/endpoints/auth/auth.endpoint';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtGuard } from './jwt/jwt.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AuthEndpoints.register)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post(AuthEndpoints.verifyUser)
  verifyUser(@Body() body) {
    const { email, code } = body;
    return this.authService.verifyUser(email, code);
  }
  
  @Post(AuthEndpoints.login)
  login(@Body() loginDto: LogInDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtGuard)
  @Patch(AuthEndpoints.resetPassword)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Req() req) {
    return this.authService.resetPassword(req.user.userId, resetPasswordDto);
  }
}
