// src/states/states.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { StatesController } from './states.controller';
import { StatesService } from './states.service';
import { CensusApiService } from './census-api.service';
import { State } from './entities/state.entity';
import { StateSection } from './entities/state-section.entity';
import { TestDataSeeder } from '../database/seeds/test-data.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([State, StateSection]),
    CacheModule.register(),
  ],
  controllers: [StatesController],
  providers: [StatesService, CensusApiService, TestDataSeeder],
  exports: [StatesService],
})
export class StatesModule {}
