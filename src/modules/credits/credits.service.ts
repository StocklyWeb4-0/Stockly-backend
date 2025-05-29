import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { Credit } from './entities/credit.entity';

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(Credit)
    private readonly creditRepository: Repository<Credit>,
  ) {}

  async create(createCreditDto: CreateCreditDto): Promise<Credit> {
    const credit = this.creditRepository.create(createCreditDto);
    return this.creditRepository.save(credit);
  }

  async findAll() {
    return this.creditRepository.find();
  }

  async findOne(id: number) {
    const credit = await this.creditRepository.findOneBy({ id });
    if (!credit) {
      throw new NotFoundException(`Crédito con id ${id} no encontrado`);
    }
    return credit;
  }

  async findBySaleId(saleId: number) {
    return this.creditRepository.find({
      where: { sale: { id: saleId } },
      relations: ['sale'],
    });
  }

  async update(id: number, updateCreditDto: UpdateCreditDto) {
    const credit = await this.creditRepository.findOneBy({ id });
    if (!credit) {
      throw new NotFoundException(`Crédito con id ${id} no encontrado`);
    }
    await this.creditRepository.update(id, updateCreditDto);
    return this.creditRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const credit = await this.creditRepository.findOneBy({ id });
    if (!credit) {
      throw new NotFoundException(`Crédito con id ${id} no encontrado`);
    }
    await this.creditRepository.remove(credit);
    return credit;
  }
}
