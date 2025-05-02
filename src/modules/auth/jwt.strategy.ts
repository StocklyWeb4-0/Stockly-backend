import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

/**
 * Estrategia JWT para Passport.
 * - Extrae el token JWT del header Authorization Bearer.
 * - Valida el token usando el secreto configurado.
 * - En validate(), obtiene el usuario asociado al token para adjuntarlo a la petición.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('Validando token JWT con payload:', payload);
    const user = await this.authService.getUserById(payload.sub);
    if (!user) {
      console.log('Usuario no encontrado para el token');
      return null;
    }
    return user;
  }
}
