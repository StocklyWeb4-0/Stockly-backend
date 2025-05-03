import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/productCategory.entity';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  async create(name: string): Promise<ProductCategory> {
    const category = this.categoryRepository.create({ name });
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

  async update(id: number, name: string): Promise<ProductCategory> {
    const category = await this.findOne(id);
    category.name = name;
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
