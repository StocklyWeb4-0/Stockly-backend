import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalesDetailDto } from './dto/create-sales-detail.dto';
import { UpdateSalesDetailDto } from './dto/update-sales-detail.dto';
import { SalesDetail } from './entities/sales-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SalesDetailService {
  constructor(
    @InjectRepository(SalesDetail)
    private readonly salesDetailRepository: Repository<SalesDetail>,
  ) {}

  // probar al hacer una 'sale'
  async create(createSalesDetailDto: CreateSalesDetailDto) {
    const salesDetail = this.salesDetailRepository.create(createSalesDetailDto);
    return this.salesDetailRepository.save(salesDetail);
  }

  async findAll() {
    return this.salesDetailRepository.find()
  }

  async findOne(id: number) {
    const salesDetail = await this.salesDetailRepository.findOneBy({id})
    if (!salesDetail) {
      throw new NotFoundException(`Sales detail with id ${id} not found`);
    }
    return salesDetail;
  }

  // probar al crear una 'sale'
  async update(id: number, updateSalesDetailDto: UpdateSalesDetailDto) {
    const salesDetail = await this.salesDetailRepository.findOneBy({id});
    if (!salesDetail) {
      throw new NotFoundException(`Sales detail with id ${id} not found`);
    }
     await this.salesDetailRepository.update(id, updateSalesDetailDto);
    return salesDetail;
  }

  // probar al crear una 'sale'
  async remove(id: number) {
    const salesDetail = await this.salesDetailRepository.findOneBy({id});
    if (!salesDetail) {
      throw new NotFoundException(`Sales detail with id ${id} not found`);
    }
    await this.salesDetailRepository.remove(salesDetail);
    return salesDetail;
  }
}
