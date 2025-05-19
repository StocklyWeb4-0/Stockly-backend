import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sale } from '../../sales/entities/sale.entity';

@Entity()
export class PaymentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Sale, sale => sale.paymentType)
  sales: Sale[];
}
