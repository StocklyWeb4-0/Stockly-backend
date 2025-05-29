import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(): Promise<PaymentType[]> {
    return this.paymentTypeRepository.find();
  }

  async findOne(id: number): Promise<PaymentType> {
    const paymentType = await this.paymentTypeRepository.findOneBy({ id });
    if (!paymentType) {
      throw new NotFoundException(`Payment Type ${id} not found`);
    }
    return paymentType;
  }

  async update(id: number, updatePaymentTypeDto: UpdatePaymentTypeDto): Promise<PaymentType> {
    const paymentType = await this.paymentTypeRepository.findOneBy({id});
    if (!paymentType) {
      throw new NotFoundException(`Payment Type ${id} not found`);
    }
    Object.assign(paymentType, updatePaymentTypeDto);
    return paymentType;
  }

  async remove(id: number) {
    const paymentType = await this.findOne(id);
    if (!paymentType) {
      throw new NotFoundException(`Payment Type ${id} not found`);
    }
    await this.paymentTypeRepository.remove(paymentType);
  }
}
