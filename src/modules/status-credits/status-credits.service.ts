import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusCredit } from './entities/status-credit.entity';

@Injectable()
export class StatusCreditsService {
  constructor(
    @InjectRepository(StatusCredit)
    private readonly statusCreditRepository: Repository<StatusCredit>,
  ) {}

  async create(name: string): Promise<StatusCredit> {
    const statusCredit = this.statusCreditRepository.create({ name });
    return this.statusCreditRepository.save(statusCredit);
  }

  async findAll(): Promise<StatusCredit[]> {
    return this.statusCreditRepository.find();
  }

  async findOne(id: number): Promise<StatusCredit> {
    const statusCredit = await this.statusCreditRepository.findOneBy({ id });
    if (!statusCredit) {
      throw new NotFoundException(`Estado de crédito con id ${id} no encontrado`);
    }
    return statusCredit;
  }

  async update(id: number, name: string): Promise<StatusCredit> {
    const statusCredit = await this.findOne(id);
    statusCredit.name = name;
    return this.statusCreditRepository.save(statusCredit);
  }

  async remove(id: number): Promise<void> {
    const statusCredit = await this.findOne(id);
    await this.statusCreditRepository.remove(statusCredit);
  }
}
