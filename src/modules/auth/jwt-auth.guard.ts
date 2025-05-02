import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard que extiende AuthGuard de Passport con estrategia 'jwt'.
 * Protege rutas que requieren autenticación validando el token JWT.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
