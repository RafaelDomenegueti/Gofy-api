import {
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AudioService } from './audio.service';
import { Response } from 'express';
import ytdl from '@distube/ytdl-core';
import { ENV } from 'src/utils/env';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get('info')
  async getAudioInfo(
    @Query('url') url?: string,
    @Query('origin') origin?: string,
  ) {
    try {
      const audio = await this.audioService.getAudioInfo(url, origin);
      return audio;
    } catch (error) {
      throw error;
    }
  }

  @Get('extract')
  async extractAudio(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      throw new BadRequestException('URL is required');
    }

    try {
      const isValid = ytdl.validateURL(url);
      if (!isValid) {
        throw new BadRequestException('Invalid YouTube URL');
      }

      // Set headers importantes para streaming funcionar no player nativo
      res.setHeader('Audio-Type', 'audio/mpeg');
      res.setHeader('Audio-Disposition', 'inline; filename=audio.mp3');
      res.setHeader('Accept-Ranges', 'bytes'); // permite seek no player
      // Nota: Audio-Length é difícil definir em streaming direto, ok sem

      const agent = ytdl.createAgent(
        // ENV.YOUTUBE_PROXY,
        ENV.YOUTUBE_COOKIES,
      );

      const audioStream = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        agent,
      });

      audioStream.on('error', (err) => {
        console.error('Erro no stream do ytdl:', err);
        if (!res.headersSent) {
          res.status(500).send('Erro ao processar o áudio');
        }
      });

      audioStream.pipe(res);
    } catch (error) {
      console.error('Erro na rota extract-audio:', error);
      throw new BadRequestException('Erro ao baixar ou processar o vídeo');
    }
  }
}
