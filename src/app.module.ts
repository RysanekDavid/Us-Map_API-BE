// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { StatesModule } from './states/states.module';
import { State } from './states/entities/state.entity';
import { StateSection } from './states/entities/state-section.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [State, StateSection],
        synchronize: true, // V produkci by mělo být false
        logging: true, // Zapneme logging pro lepší debug
        dropSchema: false, // Nevymazávat schema automaticky
        migrationsRun: true, // Automaticky spustit migrace
      }),
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    StatesModule,
  ],
})
export class AppModule {}
