import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.CAJERO)
  findAll() {
    return this.productsService.findAll();
  }

  //Buscar por nombre
  @Get('product-name')
  @Roles(Role.ADMIN, Role.CAJERO)
  findByName(@Query() query){
    const {name} = query;
    return this.productsService.findByName({name})
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CAJERO)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  // Busar por code
  @Get(':code/product-code')
  @Roles(Role.ADMIN, Role.CAJERO)
  findByCode(@Param('code') code:string){
    return this.productsService.findByCode(code)
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.CAJERO)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
