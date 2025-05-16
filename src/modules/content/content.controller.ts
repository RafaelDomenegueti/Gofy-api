import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { Response } from 'express';
import * as ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';

@UseGuards(JwtAuthGuard)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('info')
  async getContentInfo(
    @Query('url') url?: string,
    @Query('origin') origin?: string,
  ) {
    try {
      const content = await this.contentService.getContentInfo(url, origin);
      return content;
    } catch (error) {
      throw error;
    }
  }

  @Get('tags')
  async getTags() {
    try {
      const tags = await this.contentService.getTags();
      return tags;
    } catch (error) {
      throw error;
    }
  }

  @Get('extract-audio')
  async extractAudio(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      throw new BadRequestException('URL is required');
    }

    try {
      const response = await axios.get(url, { responseType: 'stream' });

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', 'inline; filename=audio.mp3');

      ffmpeg(response.data)
        .inputFormat('mp4')
        .noVideo()
        .audioCodec('libmp3lame')
        .format('mp3')
        .on('error', (err) => {
          console.error('Erro ao processar áudio:', err.message);
          if (!res.headersSent) {
            res.status(500).send('Erro ao processar o áudio');
          }
        })
        .pipe(res, { end: true });
    } catch (error) {
      throw new BadRequestException('Erro ao baixar ou processar o vídeo');
    }
  }

  @Get(':id')
  async getContent(@Param('id') id: string) {
    try {
      const content = await this.contentService.getContent(id);
      return content;
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async create(
    @Body() createContentDto: CreateContentDto,
    @Request() request: any,
  ) {
    try {
      const content = await this.contentService.create(
        createContentDto,
        request.user,
      );
      return content;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
