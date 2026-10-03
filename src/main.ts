import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  // Le frontend peut être ouvert depuis un autre appareil du même réseau
  // (téléphone, autre PC) via une adresse IP plutôt que "localhost" — d'où un
  // matcher plutôt qu'une origine unique figée. CORS_ORIGIN (.env) reste
  // acceptée telle quelle en plus, pour un déploiement avec un vrai domaine.
  const extraOrigin = config.get<string>('CORS_ORIGIN');
  const LAN_ORIGIN =
    /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):\d+$/;
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || LAN_ORIGIN.test(origin) || origin === extraOrigin) {
        callback(null, true);
      } else {
        callback(new Error(`Origine non autorisée : ${origin}`), false);
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(config.get<number>('PORT', 3008));
}
void bootstrap();
