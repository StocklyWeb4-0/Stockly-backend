import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Put } from '@nestjs/common';
import { ProductCategoriesService } from './productCategories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { CreateProductCategoriesDto } from './dto/create-product-categories.dto';
import { UpdateProductCategoriestDto } from './dto/update-product-categories.dto';

@Controller('category')
@UseGuards(JwtAuthGuard)
export class ProductCategoriesController {
  constructor(private readonly categoriesService: ProductCategoriesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() createProductCategoriesDto: CreateProductCategoriesDto) {
    return this.categoriesService.create(createProductCategoriesDto);
  }
  
  // verificar la protrccion de roles
  @Get()
  @Roles(Role.ADMIN, Role.CAJERO)
  @UseGuards(RolesGuard)
  findAll() {
    return this.categoriesService.findAll();
  }

  @Roles(Role.ADMIN, Role.CAJERO)
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  
  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateProductCategoriestDto: UpdateProductCategoriestDto) {
    return this.categoriesService.update(+id, updateProductCategoriestDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
