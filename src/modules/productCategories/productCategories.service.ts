import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/productCategory.entity';
import { CreateProductCategoriesDto } from './dto/create-product-categories.dto';
import { UpdateProductCategoriestDto } from './dto/update-product-categories.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  async create(createProductCategoriesDto: CreateProductCategoriesDto): Promise<ProductCategory> {
    const category = new ProductCategory();
    category.name = createProductCategoriesDto.name;
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<ProductCategory[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<ProductCategory> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }
    return category;
  }

  async update(id: number, updateProductCategoriestDto: UpdateProductCategoriestDto): Promise<ProductCategory> {
    const category = await this.findOne(id);
    if (updateProductCategoriestDto.name !== undefined) {
      category.name = updateProductCategoriestDto.name;
    }
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
