import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StatusCreditsService } from './status-credits.service';
import { CreateStatusCreditDto } from './dto/create-status-credit.dto';
import { UpdateStatusCreditDto } from './dto/update-status-credit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('status-credits')
export class StatusCreditsController {
  constructor(private readonly statusCreditsService: StatusCreditsService) {}

  @Post()
  create(@Body() createStatusCreditDto: CreateStatusCreditDto) {
    return this.statusCreditsService.create(createStatusCreditDto.name);
  }

  @Get()
  findAll() {
    return this.statusCreditsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.statusCreditsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateStatusCreditDto: UpdateStatusCreditDto) {
    if (!updateStatusCreditDto.name) {
      throw new Error('El nombre es requerido para actualizar el estado de crédito');
    }
    return this.statusCreditsService.update(id, updateStatusCreditDto.name);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.statusCreditsService.remove(id);
  }
}
