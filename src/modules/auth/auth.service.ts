import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Rol } from '../../entities/rol.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolesRepository: Repository<Rol>,
    private readonly jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string): Promise<Usuario> {
    const userExists = await this.usuarioRepository.findOne({ where: { email } });
    if (userExists) {
      throw new UnauthorizedException('El correo ya está registrado');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usuarioRepository.create({
      name: name,
      email: email,
      password: hashedPassword,
      active: true,
    });
    return this.usuarioRepository.save(newUser);
  }

  async validateUser(email: string, password: string): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({ where: { email }, relations: ['roles'] });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }

  async login(user: Usuario) {
    const payload = { email: user.email, sub: user.id, roles: user.roles?.map(role => role.name) || [] };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserById(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { id }, relations: ['roles'] });
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({ where: { id: userId }, relations: ['roles'] });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }
    const role = await this.rolesRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Rol con id ${roleId} no encontrado`);
    }
    if (!user.roles) {
      user.roles = [];
    }
    if (!user.roles.find(r => r.id === role.id)) {
      user.roles.push(role);
      await this.usuarioRepository.save(user);
    }
    return user;
  }
}
