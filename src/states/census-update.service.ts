// src/states/census-update.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StatesService } from './states.service';
import { CensusApiService } from './census-api.service';

@Injectable()
export class CensusUpdateService {
  private readonly logger = new Logger(CensusUpdateService.name);

  constructor(
    private readonly statesService: StatesService,
    private readonly censusApiService: CensusApiService,
  ) {}

  // Aktualizace každý měsíc
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async updateAllStateData() {
    this.logger.log('Starting monthly census data update...');

    try {
      const states = await this.statesService.findAll();

      for (const state of states) {
        try {
          await this.updateStateData(state.id);
          this.logger.log(`Updated data for ${state.name}`);
        } catch (error) {
          this.logger.error(
            `Failed to update data for ${state.name}:`,
            error.message,
          );
        }
      }

      this.logger.log('Monthly census data update completed');
    } catch (error) {
      this.logger.error('Failed to complete monthly update:', error.message);
    }
  }

  private async updateStateData(stateId: number) {
    const state = await this.statesService.findOne(stateId);
    const fips = state.census_metadata?.state_fips;

    if (!fips) {
      throw new Error(`No FIPS code found for state ${state.name}`);
    }

    const [demographics, housing, education] = await Promise.all([
      this.censusApiService.getStateDemographics(fips),
      this.censusApiService.getStateHousingData(fips),
      this.censusApiService.getStateEducationData(fips),
    ]);

    await this.statesService.update(stateId, {
      population: demographics.totalPopulation,
      household_income: demographics.medianHouseholdIncome,
      unemployment_rate:
        (demographics.unemploymentCount / demographics.totalPopulation) * 100,
      median_home_value: housing.medianHomeValue,
      median_rent: housing.medianRent,
      higher_education_total: education.higherEducationTotal,
      education_breakdown: education.educationBreakdown,
      census_metadata: {
        ...state.census_metadata,
        last_updated: new Date(),
      },
    });
  }
}
