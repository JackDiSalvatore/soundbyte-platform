import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Open API Docs
  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('Your API description')
    .setVersion('1.0')
    // .addTag('your-tag') // Optional: Add tags for grouping endpoints
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // 'api' is the path where Swagger UI will be served

  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key', // TODO
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
    origin: [
      process.env.FRONTEND_BASE_URL,
      'http://127.0.0.1:3000',
      'https://your-frontend-domain.com',
    ], // Specify allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed request headers
    credentials: true, // Allow sending cookies and authentication headers
  });

  // Set version
  // app.setGlobalPrefix('api/v1');

  const port = process.env.PORT ?? 3002;

  await app.listen(port);

  console.log('Streaming API server running on PORT: ', port);
}
bootstrap();
