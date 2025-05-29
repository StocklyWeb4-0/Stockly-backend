import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSaleStatusDto } from './dto/create-sale-status.dto';
import { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
import { SaleStatus } from './entities/sale-status.entity';

@Injectable()
export class SaleStatusService {
  constructor(
    @InjectRepository(SaleStatus)
    private readonly saleStatusRepository: Repository<SaleStatus>,
  ) {}

  async create(createSaleStatusDto: CreateSaleStatusDto): Promise<SaleStatus> {
    const saleStatus = this.saleStatusRepository.create(createSaleStatusDto);
    return this.saleStatusRepository.save(saleStatus);
  }

  async findAll(): Promise<SaleStatus[]> {
    return this.saleStatusRepository.find();
  }

  async findOne(id: number) {
    const saleStatus = await this.saleStatusRepository.findOneBy({ id });
    if (!saleStatus) {
      throw new NotFoundException(`Sale status with id ${id} not found`);
    }
    return saleStatus;
  }

  async update(id: number, updateSaleStatusDto: UpdateSaleStatusDto){
    const saleStatus = await this.saleStatusRepository.findOneBy({ id });
    if (!saleStatus){
      throw new NotFoundException(`Sale status whit ${id} not found`);
    }
    await this.saleStatusRepository.update(id, updateSaleStatusDto);
    return saleStatus
  }

  async remove(id: number){
    const saleStatus = await this.saleStatusRepository.findOneBy({id});
    if(!saleStatus) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    await this.saleStatusRepository.remove(saleStatus);
    return saleStatus;
  }
}
