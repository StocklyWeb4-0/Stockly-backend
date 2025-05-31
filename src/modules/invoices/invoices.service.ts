import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { Repository } from 'typeorm';
import { createInvoicePdf } from './pdf-generator';
import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { Invoice } from './entities/invoice.entity';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class InvoicesService {
  private transporter;

  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {
    // Configuración del transporte SMTP para nodemailer
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com', // Cambiar por el host SMTP real
      port: 587,
      secure: false,
      auth: {
        user: 'usuario@example.com', // Cambiar por usuario real
        pass: 'password', // Cambiar por contraseña real
      },
    });
  }

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

  async saveInvoiceFile(saleId: number): Promise<string> {
    const pdfBuffer = await this.generatePdf(saleId);
    const invoicesDir = join(process.cwd(), 'invoices');
    try {
      await fs.mkdir(invoicesDir, { recursive: true });
    } catch (error) {
      throw new InternalServerErrorException('Error al crear directorio de facturas');
    }
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

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await this.generatePdf(saleId);
    } catch (error) {
      throw new InternalServerErrorException('Error al generar el PDF de la factura');
    }

    // Texto automatico al enviar correo
    const mailOptions: MailOptions = {
      from: '"Distribuidora StocklyWeb" <no-reply@stocklyweb.com>',
      to: recipientEmail,
      subject: `Factura de Venta N° ${sale.id}`,
      text: `Estimado cliente,\n\nAdjuntamos la factura de su compra realizada el ${new Date(sale.date).toLocaleDateString()}.\n\nGracias por su preferencia.\n\nAtentamente,\nDistribuidora StocklyWeb`,
      attachments: [
        {
          filename: `Factura_${sale.id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Correo enviado correctamente' };
    } catch (error) {
      throw new InternalServerErrorException('Error al enviar el correo electrónico');
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
