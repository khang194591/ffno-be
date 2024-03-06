import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { AppPrismaModule } from './config/prisma.module';
import { modules } from './modules';

@Module({
  imports: [AppConfigModule, AppPrismaModule, ...modules],
})
export class AppModule {}
