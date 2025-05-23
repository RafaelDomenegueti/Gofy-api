import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export default class PurchaseRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(where: Prisma.PurchaseWhereInput) {
    const findPurchase = await this.prisma.purchase.findFirst({
      where,
    });

    return findPurchase;
  }

  async findMany(data: Prisma.PurchaseFindManyArgs) {
    const findPurchase = await this.prisma.purchase.findMany(data);

    return findPurchase;
  }

  async create(data: Prisma.PurchaseUncheckedCreateInput) {
    const PurchaseCreated = await this.prisma.purchase.create({
      data,
    });

    return PurchaseCreated;
  }

  async update(
    data: Prisma.PurchaseUncheckedUpdateInput,
    where: Prisma.PurchaseWhereUniqueInput,
  ) {
    const PurchaseUpdated = await this.prisma.purchase.update({
      data,
      where,
    });

    return PurchaseUpdated;
  }

  async delete(where: Prisma.PurchaseWhereUniqueInput) {
    const purchaseCanceled = await this.prisma.purchase.delete({
      where,
    });

    return purchaseCanceled;
  }
}
