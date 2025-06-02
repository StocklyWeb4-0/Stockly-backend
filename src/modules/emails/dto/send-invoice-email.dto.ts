export class SendInvoiceEmailDto {
  customerEmail: string;
  saleId: number;
  pdfBuffer: Buffer;
  customerName: string;
}
