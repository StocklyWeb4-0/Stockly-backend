import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return product;
  }

  async findByCode(code: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ code });
    if (!product) {
      throw new NotFoundException(`Producto con código ${code} no encontrado`);
    }
    return product;
  }

  //buscar por nombre o parte del nombre
  async findByName(filters?: {name: string}): Promise<Product[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product')

  if (filters?.name) {
    queryBuilder.andWhere('product.name LIKE :name', { name: `%${filters.name}%` });
  }

  return queryBuilder.getMany();
  }

  async reduceStock(id: number, quantity: number): Promise<void> {
    const product = await this.findOne(id);
    if (product.stock < quantity) {
      throw new ForbiddenException(`Stock insuficiente para el producto ${product.name}`);
    }
    product.stock -= quantity;
    await this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  // websokets notificaiones stock bajo
}
