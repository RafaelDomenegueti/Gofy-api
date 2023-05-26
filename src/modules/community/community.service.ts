import { Injectable } from '@nestjs/common';
import ContentRepository from 'src/shared/repositories/content/content.repository';

@Injectable()
export class CommunityService {
  constructor(private readonly contentRepository: ContentRepository) {}

  async search(search: string) {
    const searchContents = await this.contentRepository.findAll({
      where: {
        title: {
          contains: search,
          mode: 'insensitive',
        },
        isPublic: true,
      },
      take: 15,
    });

    return searchContents;
  }
}
