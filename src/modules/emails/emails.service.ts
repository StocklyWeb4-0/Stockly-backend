import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendInvoiceEmailDto } from './dto/send-invoice-email.dto';

@Injectable()
export class EmailsService {

  constructor(private readonly mailerService: MailerService){}

  // async sendUserAlertStock (user: User, stock){}

  async sendInvoiceEmail(data: SendInvoiceEmailDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: data.customerEmail,
        subject: `Factura de Venta N° ${data.saleId}`,
        template: './invoice-customer', // ruta emails/templates
        context: {
          saleId: data.saleId,
          date: new Date().toLocaleDateString(),
          customerName: data.customerName,
        },
        attachments: [
          {
            filename: `Factura_${data.saleId}.pdf`,
            content: data.pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
    } catch (error) {
      throw error; // Propagar error original para mejor diagnóstico
    }
  }

  // Alerta de stock bajo
  async alertStock(id: number, name: string, stock: number, description: string, email: string){
    await this.mailerService.sendMail({
      to: email, // destinatario del email de productService
      subject: `Stock bajo`,
      template: './alert-stock',
      context: {
        id: id,
        name: name,
        stock: stock,
        description: description,
        year: new Date().getFullYear(), // copy-> derechos reservados jaja
      }
    })
  }
}
