import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Sale } from '../../sales/entities/sale.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale)
  @JoinColumn({ name: 'idSale' })
  sale: Sale;

  @Column({ type: 'varchar', length: 255 })
  filePath: string;

  @CreateDateColumn()
  createdAt: Date;
}
