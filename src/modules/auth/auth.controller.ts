import { Controller, Post, BadRequestException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('login')
  async login(
    @Body() body: { email: string; password: string }
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Post('init-admin')
  async initAdmin() {
    try {
      const admin = await this.authService.initAdmin();
      return {
        message: 'Administrador inicial creado correctamente',
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
