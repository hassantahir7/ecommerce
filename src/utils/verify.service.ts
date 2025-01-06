import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { generateRandom4DigitNumber } from './util.function';

@Injectable()
export class VerifyService {
  constructor(private readonly prismaService: PrismaService) {}

  async generateAndStoreOTP(email: string) {
    try {
      const previousUser = await this.prismaService.verifyUser.findUnique({
        where: {
          email: email,
        },
      });
      if (previousUser) {
        await this.prismaService.verifyUser.delete({
          where: {
            id: previousUser.id,
          },
        });
      }

      const randomNumber = generateRandom4DigitNumber();

      const userToVerify = await this.prismaService.verifyUser.create({
        data: {
          email: email,
          otp: randomNumber,
        },
      });
      return userToVerify;
    } catch (error) {
      throw new HttpException(
        `Failed to generate and store random number: ${error.message}`,
        500,
      );
    }
  }

  //   async verifyOTPForEmailChange(email: string, otp: string): Promise<object> {
  //     try {
  //       const userToVerify = await this.prismaService.verifyUser.findFirst({
  //         where: {
  //           email: email,
  //         },
  //       });

  //       if (!userToVerify) {
  //         throw new BadRequestException(
  //           `User with email : ${email} does not exists for verification`,
  //         );
  //       }
  //       if (userToVerify.verificationTries >= 3) {
  //         await this.prismaService.verifyUser.delete({
  //           where: {
  //             email: userToVerify.email,
  //           },
  //         });
  //         throw new NotAcceptableException(`Too many tries`);
  //       }
  //       // Check if the OTP record was created within the last 5 minutes
  //       const createdAt = new Date(userToVerify.createdAt).getTime();
  //       const currentTime = new Date().getTime();
  //       const timeDifference = currentTime - createdAt;
  //       const fiveMinutesInMilliseconds = 200 * 60 * 1000; //chnage this 2000 to 5

  //       if (timeDifference > fiveMinutesInMilliseconds) {
  //         await this.prismaService.verifyUser.delete({
  //           where: {
  //             email: userToVerify.email,
  //           },
  //         });
  //         // If the OTP record is older than 5 minutes,throw error
  //         throw new BadRequestException(`OTP expired for username : ${email}`);
  //       }

  //       if (userToVerify.otp !== otp) {
  //         await this.prismaService.verifyUser.update({
  //           where: {
  //             id: userToVerify.id,
  //           },
  //           data: {
  //             verificationTries: { increment: 1 },
  //           },
  //         });
  //         return { message: `OTP enterned is incorrect` };
  //       }

  //       if (userToVerify.otp === otp) {
  //         return { message: true };
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  async verifyOTP(email: string, otp: string): Promise<object> {
    try {
      const userToVerify = await this.prismaService.verifyUser.findFirst({
        where: {
          email: email,
        },
      });

      if (!userToVerify) {
        throw new HttpException(
          `User with email : ${email} does not exists for verification`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (userToVerify.verificationTries >= 3) {
        await this.prismaService.verifyUser.delete({
          where: {
            email: userToVerify.email,
          },
        });
        throw new HttpException(`Too many tries!`, HttpStatus.NOT_ACCEPTABLE);
      }

      const createdAt = new Date(userToVerify.createdAt).getTime();
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - createdAt;
      const fiveMinutesInMilliseconds = 200 * 60 * 1000;

      if (timeDifference > fiveMinutesInMilliseconds) {
        await this.prismaService.verifyUser.delete({
          where: {
            email: userToVerify.email,
          },
        });

        throw new HttpException(
          `OTP expired for email : ${email}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (userToVerify.otp !== otp) {
        await this.prismaService.verifyUser.update({
          where: {
            id: userToVerify.id,
          },
          data: {
            verificationTries: { increment: 1 },
          },
        });
        throw new HttpException(`Incorrect OTP!`, HttpStatus.BAD_REQUEST);
      }

      if (userToVerify.otp === otp) {
        const verifyUsername = await this.prismaService.user.update({
          where: {
            email: userToVerify.email,
          },
          data: {
            is_emailVerified: true,
          },
        });
        await this.prismaService.verifyUser.delete({
          where: {
            email: userToVerify.email,
          },
        });
        return verifyUsername;
        //return { message: `User ${username} verified.` };
      }

      // If the OTP is valid and within the time limit
      //return { message: `User ${username} verified. Please use ${username} for login` };
      //     const token = await this.auth.generateToken(userToVerify.id, 'Patient')

      //   return {access_token :token};
    } catch (error) {
      throw error;
    }
  }
}
