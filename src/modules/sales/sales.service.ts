import { Injectable, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale, SaleStatus } from './entities/sale.entity'; // Import SaleStatus
import { SalesDetail } from '../sales-detail/entities/sales-detail.entity';
import { ProductsService } from '../products/products.service';
import { Usuario } from '../users/entities/users.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(SalesDetail)
    private readonly salesDetailRepository: Repository<SalesDetail>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createSaleDto: CreateSaleDto, user: Usuario): Promise<Sale> {
    const { products, paymentType } = createSaleDto;

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    let total = 0;
    const salesDetails: SalesDetail[] = [];

    for (const item of products) {
      const product = await this.productsService.findByCode(item.code);

      if (product.stock < item.quantity) {
        throw new ForbiddenException(`Stock insuficiente para el producto ${product.name}`);
      }

      const subtotal = Number((product.price * item.quantity).toFixed(2));
      total += subtotal;

      const salesDetail = new SalesDetail();
      salesDetail.product = product;
      salesDetail.quantity = item.quantity;
      salesDetail.unitPrice = product.price;
      salesDetail.subtotal = subtotal;

      salesDetails.push(salesDetail);
    }

    const sale = new Sale();
    sale.date = new Date();
    sale.total = Number(total.toFixed(2));
    sale.user = user;
    sale.paymentType = paymentType;
    sale.status = SaleStatus.COMPLETED;
    sale.details = salesDetails;

    const savedSale = await this.saleRepository.save(sale);

    // Reducir stock después de guardar la venta
    for (const item of products) {
      const product = await this.productsService.findByCode(item.code);
      await this.productsService.reduceStock(product.id, item.quantity);
    }

    return savedSale;
  }

  async findAll(): Promise<Sale[]> {
    return this.saleRepository.find({ relations: ['user', 'details', 'details.product'] });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['user', 'details', 'details.product'],
    });
    if (!sale) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }
    return sale;
  }
}
