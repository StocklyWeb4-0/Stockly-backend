import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SaleStatusService } from './sale-status.service';
import { CreateSaleStatusDto } from './dto/create-sale-status.dto';
import { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Role } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';

@Controller('sale-status')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class SaleStatusController {
  constructor(private readonly saleStatusService: SaleStatusService) {}

  @Post()
  create(@Body() createSaleStatusDto: CreateSaleStatusDto) {
    return this.saleStatusService.create(createSaleStatusDto);
  }

  @Get()
  findAll() {
    return this.saleStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleStatusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleStatusDto: UpdateSaleStatusDto) {
    return this.saleStatusService.update(+id, updateSaleStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saleStatusService.remove(+id);
  }
}
