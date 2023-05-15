import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export default class ContentRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(where: Prisma.ContentWhereUniqueInput) {
    const findContent = await this.prisma.content.findFirst({
      where,
    });

    return findContent;
  }

  async findAll(data: Prisma.ContentFindManyArgs) {
    const findContent = await this.prisma.content.findMany(data);

    return findContent;
  }

  async create(data: Prisma.ContentUncheckedCreateInput) {
    const contentCreated = await this.prisma.content.create({
      data,
    });

    return contentCreated;
  }
}
