import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { ProductCategoriesModule } from '../productCategories/productCategories.module';
import { EmailsModule } from '../emails/emails.module';
import { UsersModule } from '../users/users.module';
import { Usuario } from '../roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Usuario]),
    ProductCategoriesModule,
    EmailsModule,
    UsersModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
