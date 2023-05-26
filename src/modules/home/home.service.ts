import { Injectable } from '@nestjs/common';
import ContentRepository from 'src/shared/repositories/content/content.repository';
import TagRepository from 'src/shared/repositories/tag/tag.repository';

@Injectable()
export class HomeService {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async homeInit() {
    // Get banners
    const banners = await this.contentRepository.findAll({
      where: {
        isPublic: true,
      },
      include: {
        _count: {
          select: {
            purchases: true,
          },
        },
      },
      orderBy: {
        purchases: {
          _count: 'desc',
        },
      },
      take: 3,
    });

    const contents: any = await this.tagRepository.findAll({
      where: {
        contentTags: {
          some: {},
        },
      },
      include: {
        contentTags: {
          include: {
            tag: false,
            content: {
              select: {
                id: true,
                title: true,
                banner: true,
              },
            },
          },
          orderBy: {
            content: {
              purchases: {
                _count: 'desc',
              },
            },
          },
          take: 10,
        },
        _count: {
          select: {
            contentTags: true,
          },
        },
      },
    });

    return {
      banners,
      body: {
        data: contents,
      },
    };
  }
}
