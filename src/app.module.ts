import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config/constans';
import { Usuario } from './models/usuario.entity'; // Importar entidad Usuario
import { Rol } from './models/rol.entity'; // Importar entidad Rol
import { People } from './models/people.entity'; // Importar entidad People

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // TYPEORM BD
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql', // para usar MySqlWorkbrench
        host: configService.get<string>(DB_HOST),
        port: +(configService.get<number>(DB_PORT) ?? 3306),
        username: configService.get<string>(DB_USER),
        password: configService.get<string>(DB_PASSWORD),
        database: configService.get<string>(DB_DATABASE),
        entities: [Usuario, Rol, People], // Agregar las entidades aquí
        synchronize: true,
        logging: false, // muestra en consola SQL ejecutado
      }),
      inject: [ConfigService], // inject db
    }),
  ], // para serviceConfig del port
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}