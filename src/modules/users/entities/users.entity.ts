import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { Rol } from '../../roles/entities/role.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  active: boolean;

  @ManyToMany(() => Rol, (rol) => rol.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Rol[];
}