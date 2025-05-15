import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';

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
