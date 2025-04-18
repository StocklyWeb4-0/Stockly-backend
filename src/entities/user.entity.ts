import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { Rol } from './rol.entity';
import { People } from './people.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  contraseña: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  rol: Rol;

  @OneToOne(() => People, (people) => people.usuario)
  people: People;
}