import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LogInDto } from './dto/login.dto';
import { AuthEndpoints } from 'src/common/endpoints/auth.endpoint';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtGuard } from './jwt/jwt.guard';
import { ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SendOTPDto } from './dto/send-otp.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SubscriptionDto } from './dto/subscription.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Post(AuthEndpoints.register)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Update Subscription' })
  @UseGuards(JwtGuard)
  @Get(AuthEndpoints.updateSubscription)
  async handleSubscription(@Req() req, @Body() subscriptionDto: SubscriptionDto) {
    return this.authService.handleSubscription(subscriptionDto, req.user.id || req.user.userId);
  }


  @ApiOperation({ summary: 'Find one user' })
  @UseGuards(JwtGuard)
  @Get(AuthEndpoints.getOneUser)
  async getUser(@Req() req) {
    return this.authService.getUser(req.user.id || req.user.userId);
  }

  @ApiOperation({ summary: 'Update the user' })
  @UseGuards(JwtGuard)
  @Patch(AuthEndpoints.updateUser)
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(req.user.id || req.user.userId, updateUserDto);
  }

  @ApiOperation({ summary: 'Verify a user by email and verification code' })
  @Post(AuthEndpoints.verifyUser)
  verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    return this.authService.verifyUser(verifyUserDto.email, verifyUserDto.code);
  }
  
  @ApiOperation({ summary: 'Log in an existing user' })
  @Post(AuthEndpoints.login)
  login(@Body() loginDto: LogInDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Reset password for an authenticated user' })
  @UseGuards(JwtGuard)
  @Patch(AuthEndpoints.resetPassword)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Req() req) {
    return this.authService.resetPassword(req.user.userId, resetPasswordDto);
  }

  @ApiOperation({ summary: 'Send otp for users who forgot their password' })
  @Post(AuthEndpoints.sendOTP)
  sendOtp(@Body() sendOTPDto: SendOTPDto) {
    return this.authService.sendOtp(sendOTPDto);
  }

  @Post(AuthEndpoints.updatePassword)
  @ApiOperation({ summary: 'Update user password' })
  async updatePassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.updatePassword(forgetPasswordDto);
  }
}
