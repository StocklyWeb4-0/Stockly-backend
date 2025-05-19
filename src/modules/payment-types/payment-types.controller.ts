import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { PaymentTypesService } from './payment-types.service';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('payment-types')
@UseGuards(JwtAuthGuard) // verificar que tenga Token
export class PaymentTypesController {
  constructor(private readonly paymentTypesService: PaymentTypesService) {}

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  create(@Body() createPaymentTypeDto: CreatePaymentTypeDto) {
      return this.paymentTypesService.create(createPaymentTypeDto.name);
  }

  @Get()
  @Roles('admin')
  @UseGuards(RolesGuard)
  findAll() {
    return this.paymentTypesService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.paymentTypesService.findOne(+id);
  }

  @Put(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updatePaymentTypeDto: UpdatePaymentTypeDto) {
    return this.paymentTypesService.update(+id, updatePaymentTypeDto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.paymentTypesService.remove(+id);
  }
}
