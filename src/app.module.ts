import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [PrismaModule, ImageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
