import { Controller, Get, Param, Res, Post, Body, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Response } from 'express';
import { SendInvoiceEmailDto } from './dto/send-invoice-email.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { Role } from '../roles/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.CAJERO)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async findAll() {
    return this.invoicesService.findAllInvoices();
  }

  @Get(':id/download')
  async downloadInvoice(@Param('id') id: number, @Res() res: Response) {
    const invoice = await this.invoicesService.findInvoiceById(id);
    if (!invoice) {
      throw new NotFoundException('Factura no encontrada');
    }
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Factura_${invoice.sale.id}.pdf`,
    });
    res.sendFile(invoice.filePath);
  }

  @Post(':id/send-email')
  async sendInvoiceEmail(@Param('id') id: number, @Body() sendInvoiceEmailDto: SendInvoiceEmailDto) {
    const invoice = await this.invoicesService.findInvoiceById(id);
    if (!invoice) {
      throw new NotFoundException('Factura no encontrada');
    }
    // Enviar correo a email proporcionado o al email del cliente de la venta
    return this.invoicesService.sendInvoiceEmail(invoice.sale.id, sendInvoiceEmailDto.email);
  }
}
