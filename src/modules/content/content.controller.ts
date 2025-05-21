import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContentService } from './content.service';
import { CreateContentDto, contentSchema } from './schema/content.schema';
import { validate } from '../../utils/zod-validator';

@UseGuards(JwtAuthGuard)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('tags')
  async getTags() {
    try {
      const tags = await this.contentService.getTags();
      return tags;
    } catch (error) {
      throw error;
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
  async create(@Body() contentData: CreateContentDto, @Request() request: any) {
    try {
      const validatedData = validate(contentSchema, contentData);
      const content = await this.contentService.create(
        validatedData,
        request.user,
      );
      return content;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
