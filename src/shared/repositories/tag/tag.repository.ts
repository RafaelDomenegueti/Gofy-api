import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export default class TagRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(where: Prisma.TagWhereUniqueInput) {
    const findTag = await this.prisma.tag.findFirst({
      where,
    });

    return findTag;
  }

  async findAll(data: Prisma.TagFindManyArgs) {
    const findTag = await this.prisma.tag.findMany(data);

    return findTag;
  }
}
