import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      },
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: [process.env.FRONTEND_BASE_URL, 'https://your-frontend-domain.com'], // Specify allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed request headers
    credentials: true, // Allow sending cookies and authentication headers
  });

  // Set version
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
