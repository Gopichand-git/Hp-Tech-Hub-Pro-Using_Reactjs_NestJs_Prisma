import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma.service'; // adjust path based on your structure

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService], // ✅ Add PrismaService here
})
export class ProductModule {}
