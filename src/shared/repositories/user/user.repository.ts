import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export default class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(where: Prisma.UserWhereUniqueInput) {
    const findUser = await this.prisma.user.findFirst({
      where,
    });

    return findUser;
  }

  async create(data: Prisma.UserUncheckedCreateInput) {
    const userCreated = await this.prisma.user.create({
      data,
    });

    return userCreated;
  }

  async update(data: Prisma.UserUpdateArgs) {
    const userUpdated = await this.prisma.user.update(data);

    return userUpdated;
  }
}
