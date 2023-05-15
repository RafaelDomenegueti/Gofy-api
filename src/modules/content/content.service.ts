import { Injectable } from '@nestjs/common';
import { AppError } from 'src/shared/errors/AppError';
import ContentRepository from 'src/shared/repositories/content/content.repository';
import TagRepository from 'src/shared/repositories/tag/tag.repository';
import CloudinaryClientService from 'src/shared/services/CloudinaryClient/cloudinary-client.service';
import { CreateContentDto } from './dto/create-content.dto';

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

    const uploadedImage = await this.cloudinaryClient.send(banner);

    const contentCreated = await this.contentRepository.create({
      banner: uploadedImage.url,
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
}
