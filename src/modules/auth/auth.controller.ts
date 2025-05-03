import { Controller, Patch, Param, Body, UseGuards, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string }
  ) {
    return this.authService.register(body.name, body.email, body.password);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string }
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Patch('users/:id/roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async assignRoleToUser(
    @Param('id') userId: number,
    @Body() assignRoleDto: AssignRoleDto,
  ) {
    return this.authService.assignRoleToUser(userId, assignRoleDto.roleId);
  }
}
