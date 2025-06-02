import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SalesDetailService } from './sales-detail.service';
import { CreateSalesDetailDto } from './dto/create-sales-detail.dto';
import { UpdateSalesDetailDto } from './dto/update-sales-detail.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';


@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.CAJERO)
@Controller('sales-detail')
export class SalesDetailController {
  constructor(private readonly salesDetailService: SalesDetailService) {}

  @Post()
  create(@Body() createSalesDetailDto: CreateSalesDetailDto) {
    return this.salesDetailService.create(createSalesDetailDto);
  }

  @Get()
  findAll() {
    return this.salesDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalesDetailDto: UpdateSalesDetailDto) {
    return this.salesDetailService.update(+id, updateSalesDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesDetailService.remove(+id);
  }
}
