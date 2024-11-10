// src/database/seeds/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeedCommand } from './seed.command';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const command = app.get(SeedCommand);

  try {
    console.log('Starting seed...');
    await command.seedStates();
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
