import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { PaymentsCreditsService } from './payments-credits.service';
import { CreatePaymentsCreditDto } from './dto/create-payments-credit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.CAJERO)
@Controller('payments-credits')
export class PaymentsCreditsController {
  constructor(private readonly paymentsCreditsService: PaymentsCreditsService) {}

  @Post()
  create(@Body() createPaymentsCreditDto: CreatePaymentsCreditDto) {
    return this.paymentsCreditsService.create(createPaymentsCreditDto);
  }

  @Get()
  findAll() {
    return this.paymentsCreditsService.findAll();
  }

  @Get('expected-amount/:creditId')
  async getExpectedAmountPerPayment(@Param('creditId') creditId: number) {
    return this.paymentsCreditsService.getExpectedAmountPerPayment(creditId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.paymentsCreditsService.findOne(id);
  }

  //Hostorial de pagos de un credito
  @Get('history/:creditId')
  async getPaymentHistory(@Param('creditId') creditId: number){
    return this.paymentsCreditsService.getPaymentHistory(creditId)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.paymentsCreditsService.remove(id);
  }
}
