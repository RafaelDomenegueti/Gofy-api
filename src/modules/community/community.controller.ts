import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommunityService } from './community.service';

@UseGuards(JwtAuthGuard)
@Controller('search')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get(':search')
  async search(@Param('search') search: string) {
    try {
      const searchContents = await this.communityService.search(search);

      return searchContents;
    } catch (error) {
      throw error;
    }
  }
}
