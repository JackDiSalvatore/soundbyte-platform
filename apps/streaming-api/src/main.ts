import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './lib/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [env.FRONTEND_BASE_URL, 'https://your-frontend-domain.com'], // Specify allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed request headers
    credentials: true, // Allow sending cookies and authentication headers
  });
  app.setGlobalPrefix('api/v1');
  await app.listen(env.PORT);
}
bootstrap();
