import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { comparePassword, hashPassword } from 'src/utils/util.function';
import { VerifyService } from 'src/utils/verify.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { LogInDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOTPDto } from './dto/send-otp.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private verifyService: VerifyService,
    private mailerService: MailerService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const checkExistingEmail = await this.prismaService.user.findFirst({
        where: {
          email: registerDto.email.toLowerCase(),
        },
      });

      const checkExistingContact = await this.prismaService.user.findFirst({
        where: {
          contactNumber: registerDto.contactNumber,
        },
      });

      if (checkExistingEmail) {
        throw new HttpException(
          'This email already exists.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (checkExistingContact) {
        throw new HttpException(
          'This phone no already exists.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashedPassword = await hashPassword(registerDto.password);
      const userCreated = await this.prismaService.user.create({
        data: {
          ...registerDto,
          password: hashedPassword,
          email: registerDto.email.toLowerCase(),
        },
      });

      if (!userCreated) {
        throw new HttpException('User not created', HttpStatus.BAD_REQUEST);
      }

      const verifyData = await this.verifyService.generateAndStoreOTP(
        userCreated.email,
      );
      const body = `${verifyData.otp}`;
      await this.mailerService.sendEmail(
        registerDto.email,
        'OTP for verification Arabic Latina',
        body,
      );

      if (registerDto.subscription) {
        await this.mailerService.sendNewsletter(registerDto.email, 'Newsletter Subscription');
      }

      return {
        success: true,
        message: 'User created. Verify your account',
        data: { name: userCreated.name, email: userCreated.email },
      };
    } catch (error) {
      throw error;
    }
  }


  async verifyUser(email: string, code: string) {
    try {
      await this.verifyService.verifyOTP(email.toLowerCase(), code);

      const user = await this.prismaService.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
        select: {
          userId: true,
        },
      });

      const token = await this.generateToken(user.userId);
      return {
        success: true,
        message: 'User verified!',
        data: { access_token: token },
      };
    } catch (error) {
      throw error;
    }
  }

  async generateToken(id: string): Promise<string> {
    if (!id) {
      throw new HttpException('User Id is required', HttpStatus.BAD_REQUEST);
    }

    const payload = {
      userId: id,
    };

    const jwt_secret = this.configService.get<string>('JWT_SECRET');
    const jwt_expiryTime = this.configService.get<number>('JWT_EXPIRY_TIME');

    if (!jwt_secret || !jwt_expiryTime) {
      throw new Error(
        'JWT secret or expiry time is not set in the environment variables',
      );
    }

    try {
      const token = await this.jwt.signAsync(payload, {
        expiresIn: jwt_expiryTime,
        secret: jwt_secret,
      });

      return token;
    } catch (error) {
      throw new Error(`Failed to generate token: ${error.message}`);
    }
  }

  

  async handleSubscription(data: SubscriptionDto) {
    try {
      
      const { subscription, email, userId } = data;
  
      if (subscription) {
        if (!userId) {
          const checkExistingEmail = await this.prismaService.subscribedUsers.findFirst({
            where: { email },
          });
          if (checkExistingEmail) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
          }
          await this.prismaService.subscribedUsers.create({
            data: { email },
          });
        } else {
          const checkExistingEmail = await this.prismaService.subscribedUsers.findFirst({
            where: { email },
          });
          if (checkExistingEmail) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
          }
          await this.prismaService.subscribedUsers.create({
            data: { userId, email },
          });
  
          await this.prismaService.user.update({
            where: { userId },
            data: {
              subscription: true,
              subscriptionMail: email,
            },
          });
        }
        await this.mailerService.sendNewsletter(email, 'Newsletter Subscription');
      } else {
        await this.prismaService.subscribedUsers.deleteMany({
          where: { email },
        });
  
        if (userId) {
          await this.prismaService.user.update({
            where: { userId },
            data: {
              subscription: false,
              subscriptionMail: null,
            },
          });
        }
      }
  
      return {
        success: true,
        message: subscription ? 'You have successfully subscribed!' : 'You have successfully unsubscribed!',
        data: subscription,
      };
    } catch (error) {
      console.log("error", error)
      throw error
    }
  }
  

  async login(loginDto: LogInDto) {
    loginDto.email = loginDto.email?.trim();
    loginDto.password = loginDto.password?.trim();
    const user = await this.getUserByEmail(loginDto.email.toLowerCase());

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.is_emailVerified === false) {
      throw new NotFoundException('User not verified');
    }

    if (user.is_Deleted === true) {
      throw new NotFoundException('User is deleted');
    }

    try {
      await comparePassword(loginDto.password, user.password);
    } catch (error) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.generateToken(user.userId);

    return {
      success: true,
      message: 'Login successful',
      data: {
        access_token: token,
        name: user.name,
        email: user.email,
        address: user.address,
        contactNumber: user.contactNumber,
        profilePic: user.profilePic,
        subscription: user.subscription,
      },
    };
  }

  async getUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: {
        address: true,
      },
    });
    return user;
  }
  async findOneUserByID(userId: string) {
    return await this.prismaService.user.findUnique({
      where: {
        userId,
      },
    });
  }

  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        userId,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmNewPassword) {
      throw new HttpException(
        'New Password and Confirm New Password do not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    let comparedPassword;
    try {
      comparedPassword = await comparePassword(
        resetPasswordDto.oldPassword,
        user.password,
      );
    } catch (error) {
      throw new HttpException('Invalid old password', HttpStatus.UNAUTHORIZED);
    }

    const hashedPassword = await hashPassword(resetPasswordDto.newPassword);

    try {
      const updatedUser = await this.prismaService.user.update({
        where: {
          userId,
        },
        data: {
          password: hashedPassword,
        },
      });
      return {
        success: true,
        message: 'Password reset successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to reset password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendOtp(sendOTPDto: SendOTPDto) {
    try {
      const verifyData = await this.verifyService.generateAndStoreOTP(
        sendOTPDto.email.toLowerCase(),
      );
      const body = `${verifyData.otp}`;
      await this.mailerService.sendEmail(
        sendOTPDto.email,
        'OTP for verification Arabic Latina',
        body,
      );
      return {
        data: { email: sendOTPDto.email },
        success: true,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updatePassword(forgetPasswordDto: ForgetPasswordDto) {
    try {
      const { email, newPassword, confirmNewPassword } = forgetPasswordDto;

      if (!email || !newPassword || !confirmNewPassword) {
        throw new HttpException(
          'Missing required fields',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.prismaService.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (!user) {
        throw new HttpException(
          'User with this email does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      if (newPassword !== confirmNewPassword) {
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await hashPassword(newPassword);

      await this.prismaService.user.update({
        where: { email: email.toLowerCase() },
        data: { password: hashedPassword },
      });

      return {
        success: true,
        message: 'Password updated successfully',
        data: { email },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update password: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[],
  ): Omit<User, Key> {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key as Key)),
    ) as Omit<User, Key>;
  }

  async getUser(userId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { userId },
        include: { address: true },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const userWithoutPassword = this.exclude(user, ['password']);

      const nameParts = userWithoutPassword.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      return {
        message: 'User found successfully',
        success: true,
        data: {
          firstName,
          lastName,
          ...userWithoutPassword,
        },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { userId },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    let name;
    if (updateUserDto.firstName && updateUserDto.lastName) {
      name = `${updateUserDto.firstName} ${updateUserDto.lastName}`;
    }

    const updatedUser = await this.prismaService.user.update({
      where: { userId },
      data: {
        name: name,
        email: updateUserDto.email,
        contactNumber: updateUserDto.contactNumber,
        dateOfBirth: updateUserDto.dateOfBirth,
      },
    });

    return {
      success: true,
      message: 'User updated successfully',
      data: this.exclude(updatedUser, ['password']),
    };
  }
}
