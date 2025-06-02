import { Module, forwardRef } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { Invoice } from './entities/invoice.entity';
import { SalesModule } from '../sales/sales.module';
import { EmailsModule } from '../emails/emails.module';
import { CustomersModule } from '../customers/customers.module';
import { Customer } from '../customers/entities/customer.entity';
import { CustomersService } from '../customers/customers.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Sale, Invoice, Customer]),
    forwardRef(() => SalesModule),
    EmailsModule,
    CustomersModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, CustomersService],
  exports: [InvoicesService]
})
export class InvoicesModule {}
