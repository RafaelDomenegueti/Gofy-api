import { Global, Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import TagRepository from './tag.repository';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [TagRepository],
  exports: [TagRepository],
})
export class TagRepositoryModule {}
