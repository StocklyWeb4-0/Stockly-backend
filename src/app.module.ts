import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER, JWT_SECRET } from './config/constans';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { SalesModule } from './modules/sales/sales.module';
import { SalesDetailModule } from './modules/sales-detail/sales-detail.module';
import { SaleStatusModule } from './modules/sale-status/sale-status.module';
import { PaymentTypesModule } from './modules/payment-types/payment-types.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>(DB_HOST),
        port: +(configService.get<number>(DB_PORT) ?? 3306),
        username: configService.get<string>(DB_USER),
        password: configService.get<string>(DB_PASSWORD),
        database: configService.get<string>(DB_DATABASE),
        secretkey: configService.get<string>(JWT_SECRET), // secret key || token
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // name.entity.ts
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ProductsModule,
    RolesModule,
    UsersModule,
    SalesModule,
    SalesDetailModule,
    SaleStatusModule,
    PaymentTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
