import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export default class ContentTagsRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(data: Prisma.ContentTagFindFirstArgs) {
    const findContent = await this.prisma.contentTag.findFirst(data);

    return findContent;
  }

  async findAll(data: Prisma.ContentTagFindManyArgs) {
    const findContent = await this.prisma.contentTag.findMany(data);

    return findContent;
  }

  async create(data: Prisma.ContentTagUncheckedCreateInput) {
    const contentCreated = await this.prisma.contentTag.create({
      data,
    });

    return contentCreated;
  }
}
