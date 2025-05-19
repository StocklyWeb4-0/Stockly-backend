import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ventas')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSaleDto: CreateSaleDto, @Request() req) {
    const user = req.user;
    return this.salesService.create(createSaleDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query) {
    // Aquí se pueden implementar filtros por fecha o usuario si se desea
    return this.salesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }
}
