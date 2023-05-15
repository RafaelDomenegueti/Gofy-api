import { Global, Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import PurchaseRepository from './purchase.repository';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [PurchaseRepository],
  exports: [PurchaseRepository],
})
export class PurchaseRepositoryModule {}
