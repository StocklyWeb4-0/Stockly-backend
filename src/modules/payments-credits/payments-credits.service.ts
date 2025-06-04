import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsCredit } from './entities/payments-credit.entity';
import { CreatePaymentsCreditDto } from './dto/create-payments-credit.dto';
import { Credit } from '../credits/entities/credit.entity';
import { StatusCredit } from '../status-credits/entities/status-credit.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class PaymentsCreditsService {
  constructor(
    @InjectRepository(PaymentsCredit)
    private readonly paymentsCreditRepository: Repository<PaymentsCredit>,

    @InjectRepository(Credit)
    private readonly creditRepository: Repository<Credit>,

    @InjectRepository(StatusCredit)
    private readonly statusCreditRepository: Repository<StatusCredit>,

    private readonly emailsService: EmailsService,
  ) {}

  // registra el abono o pago de credito
  async create(createPaymentsCreditDto: CreatePaymentsCreditDto) {
    // verificar que el credito exista
    const credit = await this.creditRepository.findOneBy({ id: createPaymentsCreditDto.creditId });
    if (!credit) {
      throw new NotFoundException(`Crédito con id ${createPaymentsCreditDto.creditId} no encontrado`);
    }

    // Calcular el monto esperado por cuota usando el método existente
    const expectedAmountPerPayment = await this.getExpectedAmountPerPayment(createPaymentsCreditDto.creditId);

    // Validar que el monto pagado no sea menor al esperado
    const amountPaidRounded = Number(createPaymentsCreditDto.amountPaid.toFixed(2));
    if (amountPaidRounded < expectedAmountPerPayment) {
      throw new Error(`El monto pagado (${amountPaidRounded}) es menor al monto esperado por cuota (${expectedAmountPerPayment})`);
    }

    const paymentsCredit = this.paymentsCreditRepository.create({
      credit: { id: createPaymentsCreditDto.creditId } as any,
      amountPaid: createPaymentsCreditDto.amountPaid,
      dateAmountPaid: createPaymentsCreditDto.dateAmountPaid || new Date(),
    });

    // Actualizar el crédito según el pago registrado
    credit.paymentCount = (credit.paymentCount || 0) + 1;
    credit.total = Math.max(0, (credit.total || 0) - createPaymentsCreditDto.amountPaid); // Actualizar el total del crédito

    //estado del credito despues de hacer un pago
    const pendiente = await this.statusCreditRepository.findOne({ where: { name: 'pendiente' } });
    const finalizado = await this.statusCreditRepository.findOne({ where: { name: 'finalizado' } });

    // Si el crédito está pagado completamente, actualizar el estado
    if (credit.total <= 0 || credit.paymentCount >= credit.totalPayments) {
      if (finalizado) {
        credit.statusCredit = finalizado; // Cambiar a estado finalizado
      }
    } else {
      if (pendiente) {
        credit.statusCredit = pendiente; // Mantener o cambiar a estado pendiente
      }
    }

    await this.creditRepository.save(credit);
    await this.paymentsCreditRepository.save(paymentsCredit);
    await this.notifyPaymentCredit(credit.id, paymentsCredit.id);
    return paymentsCredit;
  }

  // fecha para la siguiente cuota
  async nextPaymentsDate(creditId: number, dateAmountPaid: Date){
    // verificar que el credito exista
    const credit = await this.creditRepository.findOneBy({ id: creditId });
    if (!credit) {
      throw new NotFoundException(`Crédito con id ${creditId} no encontrado`);
    }

    // Calcular la fecha de la siguiente cuota
    const nextPaymentDate = new Date(dateAmountPaid);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1); // Sumar un mes

    return nextPaymentDate;
  }

  // email pago credito
  async notifyPaymentCredit(creditId: number, paymentId: number) {
    const credit = await this.creditRepository.findOne({
      where: { id: creditId },
      relations: ['sale', 'sale.customer'],
    })
    if(!credit) {
      throw new NotFoundException(`Crédito con id ${creditId} no encontrado`);
    }

    // Accede al email de customer a traves de sale
    const customerEmail = credit.sale?.customer?.email;

    // cliente asocioado al credito
    if (!customerEmail) {
      throw new NotFoundException(`El cliente asociado al crédito no tiene un email registrado`);
    }

    // datos(campos) de paymentCredit
    const payment = await this.paymentsCreditRepository.findOne({where: {id: paymentId}});
    if (!payment) {
      throw new NotFoundException(`Pago con id ${paymentId} no encontrado`);
    }

    // Obtener la fecha de la siguiente cuota
    const nextPaymentDate = await this.nextPaymentsDate(creditId, payment.dateAmountPaid);

    // Info del correo .hbs
    await this.emailsService.notifyPaymnetCredit(
      payment.dateAmountPaid, 
      Number(payment.amountPaid), 
      nextPaymentDate, 
      paymentId, 
      customerEmail
    )
  }

  async findAll() {
    return this.paymentsCreditRepository.find({ relations: ['credit'] });
  }

  async findOne(id: number) {
    const paymentsCredit = await this.paymentsCreditRepository.findOne({
      where: { id },
      relations: ['credit'],
    });
    if (!paymentsCredit) {
      throw new NotFoundException(`Abono de crédito con id ${id} no encontrado`);
    }
    return paymentsCredit;
  }

  // Historial de pagos de un credito
  async getPaymentHistory(creditId: number){
    // verificar que el crdito exista
    const credit = await this.creditRepository.findOneBy({id: creditId})
    if (!credit) {
      throw new NotFoundException(`Crédito con id ${creditId} no encontrado`);
    }
    const paymentsHistory = await this.paymentsCreditRepository.find({
      where: {credit:{id: creditId}},
      order: { dateAmountPaid: 'ASC'
      }
    });

    return paymentsHistory.map((paymentsHistory, index) => ({
      paymentNumber: index + 1,
      amountPaid: paymentsHistory.amountPaid,
      dateAmountPaid: paymentsHistory.dateAmountPaid,
    }))
  }

  async remove(id: number) {
    const paymentsCredit = await this.findOne(id);
    await this.paymentsCreditRepository.remove(paymentsCredit);
    return paymentsCredit;
  }

  // Método para obtener el monto esperado por cuota de un crédito dado
  async getExpectedAmountPerPayment(creditId: number): Promise<number> {
    const credit = await this.creditRepository.findOneBy({ id: creditId });
    if (!credit) {
      throw new NotFoundException(`Crédito con id ${creditId} no encontrado`);
    }
    if (!credit.totalPayments || credit.totalPayments === 0) {
      return Number(credit.total.toFixed(2)); // Si no hay cuotas definidas, el monto es el total
    }
    const cuota = (credit.total / credit.totalPayments);
    return Number(cuota.toFixed(2));
  }
}
