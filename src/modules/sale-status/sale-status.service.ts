import { Injectable } from '@nestjs/common';
import { CreateSaleStatusDto } from './dto/create-sale-status.dto';
import { UpdateSaleStatusDto } from './dto/update-sale-status.dto';

@Injectable()
export class SaleStatusService {
  create(createSaleStatusDto: CreateSaleStatusDto) {
    return 'This action adds a new saleStatus';
  }

  findAll() {
    return `This action returns all saleStatus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} saleStatus`;
  }

  update(id: number, updateSaleStatusDto: UpdateSaleStatusDto) {
    return `This action updates a #${id} saleStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} saleStatus`;
  }
}
