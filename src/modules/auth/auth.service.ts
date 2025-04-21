import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

/**
 * Servicio de autenticación que maneja:
 * - Registro de usuarios con validación de correo único y encriptación de contraseña
 * - Validación de usuario y contraseña para login
 * - Generación de tokens JWT
 * - Obtención de usuario por ID para validación de token
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario.
   * Verifica que el correo no exista, encripta la contraseña y guarda el usuario.
   */
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

  /**
   * Valida las credenciales del usuario en login.
   * Compara la contraseña con la almacenada usando bcryptjs.
   */
  async validateUser(email: string, password: string): Promise<Usuario> {
    console.log('Validando usuario con email:', email);
    const user = await this.usuarioRepository.findOne({ where: { email } });
    console.log('Usuario encontrado:', user);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }

  /**
   * Genera un token JWT para el usuario autenticado.
   */
  async login(user: Usuario) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Obtiene un usuario por su ID.
   * Usado para validar el token JWT en la estrategia.
   */
  async getUserById(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { id } });
  }
}
