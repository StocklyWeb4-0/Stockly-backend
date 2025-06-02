import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Sale } from '../sales/entities/sale.entity';

(pdfMake as any).vfs = (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : (pdfFonts as any).vfs;

export async function createInvoicePdf(sale: Sale): Promise<Buffer> {
  const docDefinition = {
    content: [
      { text: 'Factura de Venta', style: 'header' },
      {
        columns: [
          {
            text: sale.customer ? [
              `Cliente: ${sale.customer.name}`,
              `Correo: ${sale.customer.email}`,
              `Dirección: ${sale.customer.address}`,
            ] : [
              `Correo: ${sale.customerEmail || '-'}`,
            ],
          },
          {
            text: [
              `Fecha: ${new Date(sale.date).toLocaleDateString()} ${new Date(sale.date).toLocaleTimeString()}`,
              `Factura N°: ${sale.id}`,
              `Cajero: ${sale.user.name}`,
            ],
          },
        ],
      },
      {
        table: {
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            ['Producto', 'Cantidad', 'P. Unitario', 'Subtotal'],
            ...sale.details.map(d => [
              d.product.name,
              d.quantity,
              `$${Number(d.unitPrice).toFixed(2)}`,
              `$${Number(d.subtotal).toFixed(2)}`,
            ]),
          ],
        },
        margin: [0, 20, 0, 0],
      },
      { text: `Total: $${Number(sale.total).toFixed(2)}`, style: 'total' },
      {
        text: [
          'Empresa: Distribuidora StocklyWeb\n',
          'Dirección: Calle Principal 123\n',
          'NIT: 900123456-7\n',
        ],
        margin: [0, 20, 0, 0],
      },
    ],
    styles: {
      header: { fontSize: 18, bold: true, alignment: 'center' },
      total: { bold: true, fontSize: 14, alignment: 'right' },
    },
  };

  return new Promise((resolve, reject) => {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer: Buffer) => resolve(buffer));
  });
}
