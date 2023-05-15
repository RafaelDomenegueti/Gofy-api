import { Global, Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import ContentTagsRepository from './content-tags.repository';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [ContentTagsRepository],
  exports: [ContentTagsRepository],
})
export class ContentTagsRepositoryModule {}
