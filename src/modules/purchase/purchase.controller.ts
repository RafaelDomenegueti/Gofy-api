import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseService } from './purchase.service';

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
    @Body() createPurchaseDto: CreatePurchaseDto,
    @Request() request: any,
  ) {
    try {
      const purchaseCreated = await this.purchaseService.create(
        createPurchaseDto,
        request.user,
      );

      return purchaseCreated;
    } catch (error) {
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
