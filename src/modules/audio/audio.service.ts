import { Injectable } from '@nestjs/common';
import { AppError } from 'src/shared/errors/AppError';
import ytdl from '@distube/ytdl-core';

@Injectable()
export class AudioService {
  async getAudioInfo(url?: string, origin?: string) {
    if (!url) {
      throw new AppError('Url is required');
    }

    if (origin === 'youtube') {
      const info: any = await ytdl.getInfo(url);

      return {
        videoUrl: info.videoUrl,
        thumbnails: info.videoDetails.thumbnails,
        category: info.videoDetails.category,
        uploadDate: info.videoDetails.uploadDate,
        lengthSeconds: info.videoDetails.lengthSeconds,
        title: info.videoDetails.title,
        description: info.videoDetails.description,
      };
    }

    throw new AppError("Sorry! We don't support this origin");
  }
}
