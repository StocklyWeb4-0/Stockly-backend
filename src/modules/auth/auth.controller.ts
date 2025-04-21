import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * Controlador de autenticación que define las rutas:
 * - POST /auth/register: registra un nuevo usuario
 * - POST /auth/login: valida usuario y devuelve token JWT
 * - GET /auth/me: ruta protegida que devuelve datos del usuario autenticado
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Ruta para registrar un usuario.
   */
  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.authService.register(name, email, password);
    return { message: 'Usuario registrado exitosamente', user };
  }

  /**
   * Ruta para login.
   * Valida usuario y contraseña, y devuelve token JWT.
   */
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    return this.authService.login(user);
  }

  /**
   * Ruta protegida para obtener datos del usuario autenticado.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
