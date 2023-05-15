import { Global, Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import ContentRepository from './content.repository';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [ContentRepository],
  exports: [ContentRepository],
})
export class ContentRepositoryModule {}
