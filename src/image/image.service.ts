import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class ImageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService){
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

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

  //Aws
  async uploadFile(file: Express.Multer.File): Promise<string> {
    console.log("file", file)
    const fileKey = `uploads/${uuidv4()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${fileKey}`;
  }



}

