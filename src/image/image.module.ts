import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [ConfigModule],
  controllers: [ImageController],
  exports: [CloudinaryProvider, ImageService],
  providers: [CloudinaryProvider, ImageService],
})
export class ImageModule {}
