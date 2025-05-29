import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Credit } from '../../credits/entities/credit.entity';

@Entity()
export class StatusCredit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @OneToMany(() => Credit, (credit) => credit.statusCredit)
  credits: Credit[];
}
