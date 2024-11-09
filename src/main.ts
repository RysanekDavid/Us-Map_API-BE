import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validace
  app.useGlobalPipes(new ValidationPipe());

  // CORS
  app.enableCors();

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
