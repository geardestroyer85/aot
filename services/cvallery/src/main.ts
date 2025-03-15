import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
// import { test } from 'shared';

// console.log("Is shared working in Server:", test)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  // Enable CORS
  app.enableCors({
    origin: true, // or specify your origins ['http://localhost:3000']
    credentials: true, // important for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.setGlobalPrefix('api/v1');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Profiles API')
    .setDescription('CRUD API for managing profiles')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  console.log('Server Started at Port:', port);

  await app.listen(port);
}
bootstrap();
