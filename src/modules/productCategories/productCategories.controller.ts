import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Put } from '@nestjs/common';
import { ProductCategoriesService } from './productCategories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('category')
@UseGuards(JwtAuthGuard)
export class ProductCategoriesController {
  constructor(private readonly categoriesService: ProductCategoriesService) {}

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  create(@Body('name') name: string) {
    return this.categoriesService.create(name);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Put(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body('name') name: string) {
    return this.categoriesService.update(+id, name);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
