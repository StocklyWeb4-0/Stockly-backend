import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    identification: string;

    @Column({ unique:true })
    phone: string;

    @Column({ unique:true, nullable:true})
    email: string;

    @Column()
    address: string;
}
