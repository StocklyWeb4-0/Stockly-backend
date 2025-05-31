import { Module, forwardRef } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { Invoice } from './entities/invoice.entity';
import { SalesModule } from '../sales/sales.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Sale, Invoice]),
    forwardRef(() => SalesModule),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService]
})
export class InvoicesModule {}
