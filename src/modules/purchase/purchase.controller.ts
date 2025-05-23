import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreatePurchaseDto,
  createPurchaseSchema,
} from './schema/purchase.schema';
import { PurchaseService } from './purchase.service';
import { validate } from '../../utils/zod-validator';

@UseGuards(JwtAuthGuard)
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get()
  async get(@Request() request: any) {
    try {
      const purchase = await this.purchaseService.get(request.user);

      return purchase;
    } catch (error) {
      throw error;
    }
  }

  @Delete('/cancel/:contentId')
  async cancel(@Param('contentId') contentId: string, @Request() request: any) {
    try {
      const purchase = await this.purchaseService.cancel(
        contentId,
        request.user,
      );

      return purchase;
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  async getById(@Param('id') id: string, @Request() request: any) {
    try {
      const purchase = await this.purchaseService.getById(id, request.user);

      return purchase;
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async create(
    @Body() purchaseData: CreatePurchaseDto,
    @Request() request: any,
  ) {
    try {
      const validatedData = validate(createPurchaseSchema, purchaseData);
      const purchaseCreated = await this.purchaseService.create(
        validatedData,
        request.user,
      );

      return purchaseCreated;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get('/like/add/:id')
  async addLike(@Param('id') id: string, @Request() request: any) {
    try {
      const purchase = await this.purchaseService.addLike(id, request.user);

      return purchase;
    } catch (error) {
      throw error;
    }
  }

  @Get('/like/remove/:id')
  async removeLike(@Param('id') id: string, @Request() request: any) {
    try {
      const purchase = await this.purchaseService.removeLike(id, request.user);

      return purchase;
    } catch (error) {
      throw error;
    }
  }
}
