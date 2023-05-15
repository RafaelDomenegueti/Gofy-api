import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HomeService } from './home.service';

@UseGuards(JwtAuthGuard)
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('/init')
  async homeInit() {
    try {
      const homeContents = await this.homeService.homeInit();

      return homeContents;
    } catch (error) {
      throw error;
    }
  }
}
