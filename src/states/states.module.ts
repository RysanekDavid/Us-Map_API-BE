// src/states/states.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { StatesController } from './controllers/states.controller';
import { UpdateController } from './controllers/update.controller';
import { StateDetailService } from './services/state-detail.service';
import { GovernorService } from './services/governor.service';
import { GdpService } from './services/gdp.service';
import { ElectoralVotesService } from './services/electoral-votes.service';
import { PopulationService } from './services/population.service';
import { CensusApiService } from './census-api.service';

@Module({
  imports: [ConfigModule, CacheModule.register()],
  controllers: [StatesController, UpdateController],
  providers: [
    StateDetailService,
    GovernorService,
    GdpService,
    ElectoralVotesService,
    PopulationService,
    CensusApiService,
  ],
  exports: [
    StateDetailService,
    GovernorService,
    GdpService,
    ElectoralVotesService,
    PopulationService,
    CensusApiService,
  ],
})
export class StatesModule {}
