import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Usuario } from './user.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
  
  @ManyToMany(() => Usuario, (usuario) => usuario.roles)
  users: Usuario[];
}