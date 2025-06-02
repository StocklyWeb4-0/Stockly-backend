import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale, SaleStatus } from './entities/sale.entity';
import { SalesDetail } from '../sales-detail/entities/sales-detail.entity';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';
import { SaleStatusModule } from '../sale-status/sale-status.module';
import { CreditsModule } from '../credits/credits.module';
import { PaymentTypesModule } from '../payment-types/payment-types.module';
import { StatusCreditsModule } from '../status-credits/status-credits.module';
import { Customer } from '../customers/entities/customer.entity';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SalesDetail, SaleStatus, Customer]),
    ProductsModule,
    CustomersModule,
    SaleStatusModule,
    CreditsModule,
    PaymentTypesModule,
    StatusCreditsModule,
    forwardRef(() => InvoicesModule),
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
