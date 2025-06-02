import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsCredit } from './entities/payments-credit.entity';
import { CreatePaymentsCreditDto } from './dto/create-payments-credit.dto';

@Injectable()
export class PaymentsCreditsService {
  constructor(
    @InjectRepository(PaymentsCredit)
    private readonly paymentsCreditRepository: Repository<PaymentsCredit>,
  ) {}

  async create(createPaymentsCreditDto: CreatePaymentsCreditDto) {
    const paymentsCredit = this.paymentsCreditRepository.create({
      credit: { id: createPaymentsCreditDto.creditId } as any,
      amountPaid: createPaymentsCreditDto.amountPaid,
      dateAmountPaid: createPaymentsCreditDto.dateAmountPaid,
    });
    return this.paymentsCreditRepository.save(paymentsCredit);
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

  async remove(id: number) {
    const paymentsCredit = await this.findOne(id);
    await this.paymentsCreditRepository.remove(paymentsCredit);
    return paymentsCredit;
  }
}
