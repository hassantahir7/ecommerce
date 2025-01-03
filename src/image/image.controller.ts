import { Controller, Post, Delete, UploadedFile, UseInterceptors, Body, Param, Get, HttpException, UseFilters, HttpCode, HttpStatus } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
@UseFilters(HttpExceptionFilter)
@Controller('image')
export class ImageController {
  constructor(private readonly cloudinaryService: ImageService) { }

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingleImage(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return this.cloudinaryService.uploadSingleImage(file);
  }

  @Delete('delete/single/:publicId')
  async deleteSingleImage(@Param('publicId') publicId: string): Promise<any> {
    return this.cloudinaryService.deleteSingleImage(publicId);
  }

 

}
