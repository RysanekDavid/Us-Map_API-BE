import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ensureDataFilesExist } from './utils/file.utils';

async function bootstrap() {
  // Nejdřív zajistíme existenci souborů
  await ensureDataFilesExist();

  const app = await NestFactory.create(AppModule);

  // Nastavení globální validace
  app.useGlobalPipes(new ValidationPipe());

  // Nastavení CORS - povolíme dotazy z FE (Vercel)
  app.enableCors({
    origin: ['http://localhost:5173', 'https://interactive-us-map.vercel.app'], // povolíme oba origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Nastavení globálního prefixu API
  app.setGlobalPrefix('api');

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('US Political Map API')
    .setDescription('API pro správu politické mapy USA')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
