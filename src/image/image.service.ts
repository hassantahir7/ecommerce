import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
@Injectable()
export class ImageService {

  async uploadSingleImage(file: Express.Multer.File): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = v2.uploader.upload_stream({ folder: 'BookingEngine' }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        });
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error(error.message)
      throw error;
    }
  }

  async deleteSingleImage(publicId: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        const public_id = 'BookingEngine/' + publicId
        v2.uploader.destroy(public_id, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error(error.message)
      throw error;
    }
  }

}

