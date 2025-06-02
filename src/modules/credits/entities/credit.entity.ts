import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Sale } from '../../sales/entities/sale.entity';
import { StatusCredit } from '../../status-credits/entities/status-credit.entity';

@Entity()
export class Credit {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @ManyToOne(() => Sale, (sale) => sale.credits)
    @JoinColumn({ name: 'idSale' })
    sale: Sale;

    @ManyToOne(() => StatusCredit, (status) => status.credits)
    @JoinColumn({ name: 'idStatusCredit' })
    statusCredit: StatusCredit;

    @Column({ type: 'date', nullable: true })
    paymentDeadline: Date;
}
