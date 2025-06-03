import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { EmailsService } from '../emails/emails.service';
import { Usuario } from '../roles/entities/role.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly emailsService: EmailsService, //emails

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
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
    // Verificar si el stock es bajo y enviar alerta
    await this.verifyAlertStock(id);
  }

  async verifyAlertStock(productId: number){
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Producto con id ${productId} no encontrado`);
    }

    // Verificar cantidad minima y enviar al email
    if(product.stock <= 3 || product.stock == 0){
      // obtiene todos los usuarios con rol admin
      const users = await this.usuarioRepository.createQueryBuilder('usuarios')
      .leftJoinAndSelect('usuarios.roles', 'rol')
      .where('LOWER(rol.name) = LOWER(:roleName)', { roleName: 'admin' })
      .getMany();

      for (const user of users) {
        await this.emailsService.alertStock(
          product.id, //se puede agg un campo que genero otro ID si no quieres mostrar el de la BD
          product.name,
          product.stock,
          product?.description || '--',
          user?.email || 'default@example.com'
        );
      }
    };
  }

  // Actualizar Productos
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
