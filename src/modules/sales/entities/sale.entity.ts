import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Usuario } from '../../roles/entities/role.entity';
import { SalesDetail } from '../../../modules/sales-detail/entities/sales-detail.entity';
import { PaymentType } from '../../../modules/payment-types/entities/payment-type.entity';
import { SaleStatus } from '../../../modules/sale-status/entities/sale-status.entity';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idUser' })
  user: Usuario;

  @ManyToOne(() => PaymentType)
  @JoinColumn({ name: 'idPaymentType' })
  paymentType: PaymentType;

  @ManyToOne(() => SaleStatus)
  @JoinColumn({ name: 'idSaleStatus' })
  status: SaleStatus;

  @OneToMany(() => SalesDetail, (salesDetail) => salesDetail.sale, { cascade: true })
  details: SalesDetail[];
}
export { SaleStatus };

