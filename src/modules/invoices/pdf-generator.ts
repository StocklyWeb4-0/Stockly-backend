import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Sale } from '../sales/entities/sale.entity';

(pdfMake as any).vfs = (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : (pdfFonts as any).vfs;

export async function createInvoicePdf(sale: Sale): Promise<Buffer> {
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    content: [
      {
        columns: [
          {
            width: '*',
            text: 'Distribuidora StocklyWeb\nCalle Principal 123\nNIT: 900123456-7',
            style: 'companyInfo'
          },
          {
            width: '*',
            alignment: 'right',
            text: 'Factura de Venta',
            style: 'header'
          }
        ]
      },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
      {
        columns: [
          {
            width: '*',
            margin: [0, 10, 0, 0],
            text: sale.customer ? [
              `Cliente: ${sale.customer.name}\n`,
              `Correo: ${sale.customer.email}\n`,
              `Dirección: ${sale.customer.address}`
            ] : [
              `Correo: ${sale.customerEmail || '-'}`,
            ]
          },
          {
            width: '*',
            margin: [0, 10, 0, 0],
            alignment: 'right',
            text: [
              `Fecha: ${new Date(sale.date).toLocaleDateString()} ${new Date(sale.date).toLocaleTimeString()}\n`,
              `Factura N°: ${sale.id}\n`,
              `Cajero: ${sale.user.name}`
            ]
          }
        ]
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Producto', style: 'tableHeader' },
              { text: 'Cantidad', style: 'tableHeader' },
              { text: 'P. Unitario', style: 'tableHeader' },
              { text: 'Subtotal', style: 'tableHeader' }
            ],
            ...sale.details.map(d => [
              d.product.name,
              d.quantity,
              `$${Number(d.unitPrice).toFixed(2)}`,
              `$${Number(d.subtotal).toFixed(2)}`
            ])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 20, 0, 0]
      },
      {
        text: `Total: $${Number(sale.total).toFixed(2)}`,
        style: 'total',
        margin: [0, 10, 0, 0]
      },
      {
        text: 'Gracias por su compra',
        style: 'footer',
        margin: [0, 40, 0, 0]
      }
    ],
    styles: {
      header: { fontSize: 20, bold: true, color: '#333333' },
      companyInfo: { fontSize: 10, alignment: 'left', color: '#555' },
      tableHeader: { bold: true, fontSize: 12, color: '#ffffff', fillColor: '#2E86C1' },
      total: { bold: true, fontSize: 14, alignment: 'right', color: '#000' },
      footer: { alignment: 'center', italics: true, color: '#777', fontSize: 10 }
    }
  };

  return new Promise((resolve, reject) => {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer: Buffer) => resolve(buffer));
  });
}
