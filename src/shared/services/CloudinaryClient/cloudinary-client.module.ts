import { Global, Module } from '@nestjs/common';
import CloudinaryClientService from './cloudinary-client.service';

@Global()
@Module({
  providers: [CloudinaryClientService],
  exports: [CloudinaryClientService],
})
export class CloudinaryClientModule {}
