import { Module } from '@nestjs/common';
import { SalesDetailService } from './sales-detail.service';
import { SalesDetailController } from './sales-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesDetail } from './entities/sales-detail.entity';
import { Sale } from '../sales/entities/sale.entity';
import { Product } from '../products/entities/product.entity';
import { SalesModule } from '../sales/sales.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([SalesDetail, Sale, Product]),
  SalesModule,
  ProductsModule], // Assuming SalesDetail is an entity
  controllers: [SalesDetailController],
  providers: [SalesDetailService],
})
export class SalesDetailModule {}
