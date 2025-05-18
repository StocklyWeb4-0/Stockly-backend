import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../users/entities/users.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Rol } from '../roles/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolesRepository: Repository<Rol>,
    private readonly jwtService: JwtService,
  ) {}

  async initAdmin(): Promise<Usuario> {
    const usersCount = await this.usuarioRepository.count();
    if (usersCount > 0) {
      throw new BadRequestException('Ya existen usuarios creados');
    }
    const adminRole = await this.rolesRepository.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      throw new NotFoundException('Rol admin no encontrado');
    }
    const defaultAdminEmail = 'admin@example.com';
    const defaultAdminPassword = 'admin123'; // Puedes cambiar esta contraseña por defecto
    const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);
    const newAdmin = this.usuarioRepository.create({
      name: 'Administrador',
      email: defaultAdminEmail,
      password: hashedPassword,
      active: true,
      roles: [adminRole],
    });
    return this.usuarioRepository.save(newAdmin);
  }

  /*async register(name: string, email: string, password: string): Promise<Usuario> {
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
*/

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
}
