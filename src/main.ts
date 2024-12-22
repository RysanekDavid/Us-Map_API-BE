import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ensureDataFilesExist } from './utils/file.utils';
import { AuthGuard } from './auth/auth.guard';

async function bootstrap() {
  await ensureDataFilesExist();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Výjimka pro login endpoint
  const authGuard = app.get(AuthGuard);
  app.useGlobalGuards(authGuard);

  app.enableCors({
    origin: ['http://localhost:5173', 'https://interactive-us-map.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.setGlobalPrefix('api');

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
