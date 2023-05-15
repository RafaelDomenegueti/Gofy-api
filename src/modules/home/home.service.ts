import { Injectable } from '@nestjs/common';
import ContentRepository from 'src/shared/repositories/content/content.repository';
import TagRepository from 'src/shared/repositories/tag/tag.repository';
import { tags } from '../../../data/tags';

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

    const data = [];

    for (const tag of tags) {
      const contents: any = await this.tagRepository.findAll({
        where: {
          id: tag.id,
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

      if (contents[0].contentTags.length > 0) {
        data.push(...contents);
      }
    }

    return {
      banners,
      body: {
        data,
      },
    };
  }
}
