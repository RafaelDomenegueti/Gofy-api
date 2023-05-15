import { Module } from '@nestjs/common';
import { PrismaService } from './shared/services/prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { HomeModule } from './modules/home/home.module';
import { MailModule } from './shared/services/sendMail/mail.module';
import { CommunityModule } from './modules/community/community.module';
import { ContentModule } from './modules/content/content.module';
import { PrismaModule } from './shared/services/prisma/prisma.module';
import { AxiosModule } from './shared/services/axios/axios.module';
import { ContentRepositoryModule } from './shared/repositories/content/content.module';
import { PurchaseRepositoryModule } from './shared/repositories/purchase/purchase.module';
import { TagRepositoryModule } from './shared/repositories/tag/tag.module';
import { UserRepositoryModule } from './shared/repositories/user/user.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { CloudinaryClientModule } from './shared/services/CloudinaryClient/cloudinary-client.module';

@Module({
  imports: [
    HomeModule,
    AuthModule,
    CommunityModule,
    ContentModule,
    PurchaseModule,
    MailModule,
    PrismaModule,
    AxiosModule,
    ContentRepositoryModule,
    PurchaseRepositoryModule,
    TagRepositoryModule,
    UserRepositoryModule,
    CloudinaryClientModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
