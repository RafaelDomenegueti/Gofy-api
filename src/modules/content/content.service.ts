import { Injectable } from '@nestjs/common';
import { AppError } from 'src/shared/errors/AppError';
import ContentRepository from 'src/shared/repositories/content/content.repository';
import TagRepository from 'src/shared/repositories/tag/tag.repository';
import CloudinaryClientService from 'src/shared/services/CloudinaryClient/cloudinary-client.service';
import { CreateContentDto } from './dto/create-content.dto';
import ytdl from '@distube/ytdl-core';

@Injectable()
export class ContentService {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly tagRepository: TagRepository,
    private readonly cloudinaryClient: CloudinaryClientService,
  ) {}

  async getContent(id: string) {
    const content = await this.contentRepository.findOne({
      id: id,
    });

    if (!content) {
      throw new AppError('Content not found');
    }

    return content;
  }

  async getTags() {
    const tags = await this.tagRepository.findAll({});

    return tags;
  }

  async create(createContentDto: CreateContentDto, user: any) {
    const { banner, title, description, url, author, isPublic, tags } =
      createContentDto;

    let uploadedImage;
    if (banner) {
      uploadedImage = await this.cloudinaryClient.send(banner);
    }

    const contentCreated = await this.contentRepository.create({
      banner: uploadedImage?.url,
      title,
      description,
      url,
      author,
      isPublic,
      creatorId: user.id,
      contentTags: {
        createMany: {
          data: tags.map((tag: string) => ({ tagId: tag })),
        },
      },
      purchases: {
        create: {
          userId: user.id,
          like: false,
        },
      },
    });

    return contentCreated;
  }

  async getContentInfo(url?: string, origin?: string) {
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
