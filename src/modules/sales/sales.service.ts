import { Injectable, NotFoundException, ForbiddenException, UnauthorizedException, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { SaleStatus } from '../sale-status/entities/sale-status.entity';
import { SalesDetail } from '../sales-detail/entities/sales-detail.entity';
import { ProductsService } from '../products/products.service';
import { Usuario } from '../users/entities/users.entity';
import { CreditsService } from '../credits/credits.service';
import { StatusCreditsService } from '../status-credits/status-credits.service';
import { PaymentType } from '../payment-types/entities/payment-type.entity';
import { Customer } from '../customers/entities/customer.entity';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,

    @InjectRepository(SalesDetail)
    private readonly salesDetailRepository: Repository<SalesDetail>,

    @InjectRepository(SaleStatus)
    private readonly saleStatusRepository: Repository<SaleStatus>,

    @InjectRepository(PaymentType)
    private readonly paymentTypeRepository: Repository<PaymentType>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    private readonly productsService: ProductsService,
    private readonly creditsService: CreditsService,
    private readonly statusCreditsService: StatusCreditsService,
    private readonly invoicesService: InvoicesService,
  ) {}

  async create(createSaleDto: CreateSaleDto, user: Usuario): Promise<Sale> {
    const { products, paymentType, saleStatusId, customerId } = createSaleDto;

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    let total = 0;
    const salesDetails: SalesDetail[] = [];

    // Validar stock y calcular totales
    for (const item of products) {
      const product = await this.productsService.findByCode(item.code);
      if (!product) {
        throw new NotFoundException(`Producto con código ${item.code} no encontrado`);
      }
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
    sale.details = salesDetails;

    if (saleStatusId) {
      const status = await this.saleStatusRepository.findOneBy({ id: saleStatusId });
      if (!status) {
        throw new NotFoundException(`Estado de venta con id ${saleStatusId} no encontrado`);
      }
      sale.status = status;
    } else {
      const defaultStatus = await this.saleStatusRepository.findOneBy({});
      if (!defaultStatus) {
        throw new NotFoundException('No hay estados de venta definidos');
      }
      sale.status = defaultStatus;
    }

    if (customerId) {
      sale.customer = { id: customerId } as any;
    } else if (createSaleDto.customerEmail) {
      // Para ventas sin cliente registrado, guardar el correo en la venta
      sale.customerEmail = createSaleDto.customerEmail;
    }

    const savedSale = await this.saleRepository.save(sale);

    // Guardar factura en invoices
    const filePath = await this.invoicesService.saveInvoiceFile(savedSale.id);
    await this.invoicesService.createInvoiceRecord(savedSale.id, filePath);

    // Si es crédito y hay un cliente válido, registrar crédito
    // busca de manera dinamica el id de Credito
    const creditPaymentType = await this.paymentTypeRepository.findOne({
      where: { name: 'Credito' },
    });

    if (
      creditPaymentType &&
      paymentType.id === creditPaymentType.id &&
      customerId
    ) {
      //customerEmail sale with credits
      const customer = await this.customerRepository.findOne({ where: { id: customerId } });

      if(!customer){throw new NotFoundException(`Cliente con id ${customerId} no encontrado`)}

      // Actualizar la venta con el correo del cliente
      await this.saleRepository.update(savedSale.id, {
        customerEmail: customer.email,
      })
      
      // credito a estado pendiente por defecto
      const pendingStatus = await this.statusCreditsService.findAll().then((statuses) =>
        statuses.find((status) => status.name.toLowerCase() === 'pendiente')
      );

      await this.creditsService.create({
        customer: { id: customerId },
        sale: { id: savedSale.id },
        total: total,
        amount: total,
        paymentDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        statusCredit: pendingStatus ? { id: pendingStatus.id } : { id: 0 },
      });
    }

    // Reducir stock
    for (const item of products) {
      const product = await this.productsService.findByCode(item.code);
      await this.productsService.reduceStock(product.id, item.quantity);
    }

    // Enviar factura por correo solo si es venta a crédito y hay email del cliente
    if (
      creditPaymentType &&
      paymentType.id === creditPaymentType.id &&
      sale.customerEmail
    ) {
      try {
        await this.invoicesService.sendInvoiceEmail(savedSale.id, sale.customerEmail);
        this.logger.log(`Factura enviada por correo a ${sale.customerEmail} para la venta ${savedSale.id}`);
      } catch (error) {
        this.logger.error(`Error al enviar factura por correo para la venta ${savedSale.id}: ${error.message}`);
      }
    }
    // Para ventas no a crédito, la factura se puede enviar opcionalmente por correo (no implementado aquí)

    return savedSale;
  }

  // envio posterior de factura de venta
  async resendInvoice(saleId: number): Promise<{ success: boolean; message: string }> {
    const sale = await this.saleRepository.findOne({
      where: { id: saleId },
      relations: ['customer', 'user', 'details', 'details.product'],
    });

    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }

    if (!sale.customerEmail) {
      return { success: false, message: 'No se encontró correo electrónico del cliente' };
    }

    try {
      const result = await this.invoicesService.sendInvoiceEmail(saleId, sale.customerEmail);
      return result;
    } catch (error) {
      this.logger.error(`Error al reenviar factura para la venta ${saleId}: ${error.message}`);
      return { success: false, message: 'Error al reenviar la factura' };
    }
  }

  // factura por fecha y idUser
  async findAll(filters?: { date?: string; userId?: string }): Promise<Sale[]> {
    const queryBuilder = this.saleRepository.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.user', 'user')
      .leftJoinAndSelect('sale.details', 'details')
      .leftJoinAndSelect('details.product', 'product');

    if (filters?.date) {
      queryBuilder.andWhere('DATE(sale.date) = :date', { date: filters.date });
    }
    if (filters?.userId) {
      queryBuilder.andWhere('user.id = :userId', { userId: filters.userId });
    }

    return queryBuilder.getMany();
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
