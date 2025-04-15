import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SERVER_PORT } from './config/constans';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:true});
  // importar el app.module
  const configService = app.get(ConfigService); // config ports, bd...

  // Server port
  const port = (configService.get<number>(SERVER_PORT) || 8080) // determinar que reciba un numero ->((SERVER_PORT))
  await app.listen(port);
  console.log(`Server on port ${port}`);
}
bootstrap();
