import { Controller, Get, Post, Body, Param, UseGuards, Request, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { RolesGuard } from '../roles/roles.guard';

@Controller('sale')
@UseGuards(JwtAuthGuard) // Protege todas las rutas con el guard de JWT
@Roles(Role.ADMIN, Role.CAJERO)
@UseGuards(RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto, @Request() req) {
    const user = req.user;
    return this.salesService.create(createSaleDto, user);
  }

  // buscar venta por fecha
  @Get()
  findAll(@Query() query) {
    const { date, userId } = query;
    return this.salesService.findAll({ date, userId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Post(':id/enviar-factura')
  async resendInvoice(@Param('id') id: string) {
    return this.salesService.resendInvoice(+id);
  }
}
