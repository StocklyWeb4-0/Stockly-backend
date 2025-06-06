import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, QueryBuilder } from 'typeorm';
import { Usuario } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Rol } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly roleRepository: Repository<Rol>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.userRepository.find({ relations: ['roles'] });
  }

  async findOne(id: number): Promise<Usuario> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['roles'] });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  async findByNameOrEmail(filters?: {name: string, email: string}): Promise<Usuario[]> {
    const QueryBuilder = this.userRepository.createQueryBuilder('usuarios');
    if (filters?.name) {
      QueryBuilder.andWhere('usuarios.name LIKE :name', { name: `%${filters.name}%` });
    }
    if (filters?.email) {
      QueryBuilder.andWhere('usuarios.email LIKE :email', { email: `%${filters.email}%` });
    }
    return QueryBuilder.getMany()
  }

  async create(createUserDto: CreateUserDto): Promise<Usuario> {
    const user = new Usuario();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);
    user.active = createUserDto.active ?? true;

    const roles = await this.roleRepository.find({
      where: { id: In(createUserDto.roles) },
    });
    user.roles = roles;

    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Usuario> {
    const user = await this.findOne(id);
    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.password !== undefined) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.active !== undefined) {
      user.active = updateUserDto.active;
    }
    if (updateUserDto.roles !== undefined) {
      const roles = await this.roleRepository.find({
        where: { id: In(updateUserDto.roles) },
      });
      user.roles = roles;
    }
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    user.active = false;
    await this.userRepository.save(user);
  }
}
