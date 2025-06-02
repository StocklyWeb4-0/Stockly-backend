import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { Repository } from 'typeorm';
import { createInvoicePdf } from './pdf-generator';
import { Invoice } from './entities/invoice.entity';
import { join } from 'path';
import { promises as fs } from 'fs';
import { EmailsService } from '../emails/emails.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class InvoicesService {

  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly emailsService: EmailsService,
    private readonly customersService: CustomersService,
  ) {}


  // genera pdf a partir de la venta
  async generatePdf(saleId: number): Promise<Buffer> {
    const sale = await this.saleRepository.findOne({
      where: { id: saleId },
      relations: ['customer', 'user', 'details', 'details.product', 'paymentType'],
    });

    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }

    return await createInvoicePdf(sale);
  }

  // Guardar archivo de factura
  async saveInvoiceFile(saleId: number): Promise<string> {
    const pdfBuffer = await this.generatePdf(saleId);
    const invoicesDir = join(process.cwd(), 'invoices');
    try {
      await fs.mkdir(invoicesDir, { recursive: true });
    } catch (error) {
      throw new InternalServerErrorException('Error al crear directorio de facturas');
    }
    // nombre con el que se guardan
    const filePath = join(invoicesDir, `Factura_${saleId}.pdf`);
    try {
      await fs.writeFile(filePath, pdfBuffer);
    } catch (error) {
      throw new InternalServerErrorException('Error al guardar el archivo de la factura');
    }
    return filePath;
  }

  async createInvoiceRecord(saleId: number, filePath: string): Promise<Invoice> {
    const sale = await this.saleRepository.findOneBy({ id: saleId });
    if (!sale) {
      throw new NotFoundException('Venta no encontrada para crear factura');
    }
    const invoice = new Invoice();
    invoice.sale = sale;
    invoice.filePath = filePath;
    return this.invoiceRepository.save(invoice);
  }

  //Envio posterior de Factura por email
  async sendInvoiceEmail(saleId: number, email?: string): Promise<{ success: boolean; message: string }> {
    const sale = await this.saleRepository.findOne({
      where: { id: saleId },
      relations: ['customer', 'user', 'details', 'details.product'],
    });

    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }

    const recipientEmail = email || (sale.customer ? sale.customer.email : null);

    if (!recipientEmail) {
      return { success: false, message: 'No se encontró correo electrónico del cliente' };
    }

    // Verificar que el cliente esté registrado en customers si hay correo
    if (recipientEmail) {
      const customerRegistered = await this.customersService.findByEmail(recipientEmail);
      if (!customerRegistered) {
        return { success: false, message: 'El correo electrónico no está registrado en la base de datos de clientes' };
      }
    }

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await this.generatePdf(saleId);
    } catch (error) {
      throw new InternalServerErrorException('Error al generar el PDF de la factura');
    }

    return this.emailsService.sendInvoiceEmail({
      customerEmail: recipientEmail,
      saleId: saleId,
      pdfBuffer: pdfBuffer,
      customerName: sale.customer ? sale.customer.name : 'Cliente',
    })
      .then(() => ({ success: true, message: 'Correo enviado correctamente' }))
      .catch((error) => {
        return { success: false, message: `Error al enviar el correo electrónico: ${error.message || error}` };
      });
  }

  // factura a venta sin credito
  async resendInvoiceToNonCreditCustomer(saleId: number): Promise<{ success: boolean; message: string }> {
    const sale = await this.saleRepository.findOne({
      where: { id: saleId },
      relations: ['customer', 'user', 'details', 'details.product'],
    });

    if (!sale) {
      return { success: false, message: 'Venta no encontrada' };
    }

    // Para ventas sin crédito, el cliente puede no estar registrado, pero debe tener un correo en la venta
    const emailToSend = sale.customer?.email || sale.customerEmail;
    if (!emailToSend) {
      return { success: false, message: 'No se encontró correo electrónico para enviar la factura' };
    }

    // Verificar que el cliente esté registrado en customers si hay correo
    if (emailToSend) {
      const customerRegistered = await this.customersService.findByEmail(emailToSend);
      if (!customerRegistered) {
        return { success: false, message: 'El correo electrónico no está registrado en la base de datos de clientes' };
      }
    }

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await this.generatePdf(saleId);
    } catch (error) {
      return { success: false, message: 'Error al generar el PDF de la factura' };
    }

    try {
      await this.emailsService.sendInvoiceEmail({
        customerEmail: emailToSend,
        saleId: saleId,
        pdfBuffer: pdfBuffer,
        customerName: sale.customer ? sale.customer.name : 'Cliente',
      });
      return { success: true, message: 'Factura reenviada correctamente al cliente sin crédito' };
    } catch (error) {
      return { success: false, message: 'Error al enviar el correo electrónico' };
    }
  }

  async findAllInvoices(): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      relations: ['sale'],
      order: { createdAt: 'DESC' },
    });
  }

  async findInvoiceById(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['sale'],
    });
    if (!invoice) {
      throw new NotFoundException('Factura no encontrada');
    }
    return invoice;
  }
}
