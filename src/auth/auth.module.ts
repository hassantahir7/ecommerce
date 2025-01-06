import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { VerifyService } from 'src/utils/verify.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, MailerModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, VerifyService],
})
export class AuthModule {}
