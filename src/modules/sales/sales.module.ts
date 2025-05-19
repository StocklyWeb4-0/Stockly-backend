import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './entities/sale.entity';
import { SalesDetail } from '../sales-detail/entities/sales-detail.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SalesDetail]),
    ProductsModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
