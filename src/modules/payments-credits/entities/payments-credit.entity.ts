import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Credit } from '../../credits/entities/credit.entity';

@Entity()
export class PaymentsCredit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Credit)
  @JoinColumn({ name: 'idCredit' })
  credit: Credit;

  @Column('decimal', { precision: 10, scale: 2 })
  amountPaid: number;

  @Column({ type: 'datetime' })
  dateAmountPaid: Date;
}
