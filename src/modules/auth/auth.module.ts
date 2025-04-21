import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';

/**
 * Módulo de autenticación que configura:
 * - TypeOrmModule para la entidad Usuario
 * - PassportModule para estrategias de autenticación
 * - JwtModule para manejo de tokens JWT con configuración de secreto y expiración
 * Provee AuthService y JwtStrategy, y expone AuthService para otros módulos.
 * Controlador AuthController maneja las rutas de autenticación.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
      secret: process.env.JWT_SECRET, // variable de entorno de .env
      signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
