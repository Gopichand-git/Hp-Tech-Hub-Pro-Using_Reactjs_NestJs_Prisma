import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { PrismaService } from './prisma.service'; // ✅ Import PrismaService

@Module({
  imports: [ProductModule],
  controllers: [AppController],
  providers: [AppService, PrismaService], // ✅ Register it here
})
export class AppModule {}
