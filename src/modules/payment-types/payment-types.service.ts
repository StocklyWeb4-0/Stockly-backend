import { Injectable } from '@nestjs/common';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentType } from './entities/payment-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentTypesService {
  constructor(
    @InjectRepository(PaymentType)
    private readonly paymentTypeRepository : Repository<PaymentType>,
  ){}

  async create(name: string): Promise<PaymentType> {
    const paymentType = this.paymentTypeRepository.create({name});
    return this.paymentTypeRepository.save(paymentType);
  }

  findAll() {
    return `This action returns all paymentTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentType`;
  }

  update(id: number, updatePaymentTypeDto: UpdatePaymentTypeDto) {
    return `This action updates a #${id} paymentType`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentType`;
  }
}
