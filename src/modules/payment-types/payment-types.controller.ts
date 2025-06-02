import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { PaymentTypesService } from './payment-types.service';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';

@Controller('payment-types')
@UseGuards(JwtAuthGuard) // verificar que tenga Token
@UseGuards(RolesGuard) // verificar que tenga el rol
@Roles(Role.ADMIN) // solo admin puede modificar
export class PaymentTypesController {
  constructor(private readonly paymentTypesService: PaymentTypesService) {}

  @Post()
  create(@Body() createPaymentTypeDto: CreatePaymentTypeDto) {
      return this.paymentTypesService.create(createPaymentTypeDto.name);
  }

  @Get()
  findAll() {
    return this.paymentTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentTypesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePaymentTypeDto: UpdatePaymentTypeDto) {
    return this.paymentTypesService.update(+id, updatePaymentTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentTypesService.remove(+id);
  }
}
