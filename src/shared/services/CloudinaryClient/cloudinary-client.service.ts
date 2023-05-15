import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ENV } from 'src/utils/env';

@Injectable()
export default class CloudinaryClientService {
  constructor() {
    cloudinary.config({
      cloud_name: ENV.CLOUDINARY_NAME,
      api_key: ENV.CLOUDINARY_CLIENT_ID,
      api_secret: ENV.CLOUDINARY_CLIENT_SECRET,
    });
  }

  async send(image: string) {
    const response = await cloudinary.uploader.upload(
      'data:image/jpeg;base64,' + image,
      {},
    );

    return response;
  }
}
