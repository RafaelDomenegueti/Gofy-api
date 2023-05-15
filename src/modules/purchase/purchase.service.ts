import { Injectable } from '@nestjs/common';
import { AppError } from 'src/shared/errors/AppError';
import ContentRepository from 'src/shared/repositories/content/content.repository';
import PurchaseRepository from 'src/shared/repositories/purchase/purchase.repository';
import UserRepository from 'src/shared/repositories/user/user.repository';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly userRepository: UserRepository,
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  async get(user: any) {
    const purchase = await this.purchaseRepository.findMany({
      where: {
        userId: user.id,
      },
      include: {
        content: true,
      },
    });

    return purchase;
  }

  async getById(id: string, user: any) {
    const purchase = await this.purchaseRepository.findOne({
      contentId: id,
      userId: user.id,
    });

    if (!purchase) {
      return {};
    }

    if (purchase.userId !== user.id) {
      throw new AppError('user id mismatch');
    }

    return purchase;
  }

  async create(createPurchaseDto: CreatePurchaseDto, userSended: any) {
    const { contentId } = createPurchaseDto;

    const userId = userSended.id;

    if (!contentId) {
      throw new AppError('ContentId is required');
    }

    const content = await this.contentRepository.findOne({
      id: contentId,
    });
    if (!content) {
      throw new AppError('Content not found');
    }

    const user = await this.userRepository.findOne({
      id: userId,
    });
    if (!user) {
      throw new AppError('User not found');
    }

    const purchase = await this.purchaseRepository.findOne({
      userId,
      contentId,
    });
    if (purchase) {
      throw new AppError('Purchase Already Exist');
    }

    const purchaseCreated = await this.purchaseRepository.create({
      contentId,
      userId,
      like: false,
    });

    return purchaseCreated;
  }

  async addLike(id: string, user: any) {
    const purchase = await this.purchaseRepository.findOne({
      contentId: id,
      userId: user.id,
    });

    if (!purchase) {
      throw new AppError('Purchase not found');
    }

    if (purchase.userId !== user.id) {
      throw new AppError('user id mismatch');
    }

    const purchaseLiked = await this.purchaseRepository.update(
      {
        like: true,
      },
      { id: purchase.id },
    );

    return purchaseLiked;
  }

  async removeLike(id: string, user: any) {
    const purchase = await this.purchaseRepository.findOne({
      contentId: id,
      userId: user.id,
    });

    if (!purchase) {
      throw new AppError('Purchase not found');
    }

    if (purchase.userId !== user.id) {
      throw new AppError('user id mismatch');
    }

    const purchaseDisliked = await this.purchaseRepository.update(
      {
        like: false,
      },
      { id: purchase.id },
    );

    return purchaseDisliked;
  }
}
