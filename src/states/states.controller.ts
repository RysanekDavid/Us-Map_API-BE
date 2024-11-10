// src/states/states.controller.ts
import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  NotFoundException,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { StatesService } from './states.service';
import { CensusApiService } from './census-api.service';
import { State } from './entities/state.entity';
import { StateSection } from './entities/state-section.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { TestDataSeeder } from '../database/seeds/test-data.seed';

@ApiTags('states')
@Controller('states')
@UseInterceptors(CacheInterceptor)
export class StatesController {
  constructor(
    private readonly statesService: StatesService,
    private readonly censusApiService: CensusApiService,
    private readonly testDataSeeder: TestDataSeeder,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all states' })
  @ApiResponse({ status: 200, type: [State] })
  async findAll(): Promise<State[]> {
    return this.statesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a state by ID' })
  @ApiResponse({ status: 200, type: State })
  @ApiResponse({ status: 404, description: 'State not found' })
  async findOne(@Param('id') id: string): Promise<State> {
    const state = await this.statesService.findOne(+id);
    if (!state) {
      throw new NotFoundException(`State with ID ${id} not found`);
    }
    return state;
  }

  @Post('initialize')
  @ApiOperation({ summary: 'Initialize database with test data' })
  @ApiResponse({
    status: 200,
    description: 'Database initialized with test data',
  })
  async initializeDatabase() {
    try {
      await this.testDataSeeder.seed();
      return {
        success: true,
        message: 'Database initialized with test data successfully',
      };
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new HttpException(
        'Failed to initialize database',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // src/states/states.controller.ts
  // ... ostatní importy zůstávají stejné ...

  @Post(':id/census')
  @ApiOperation({ summary: 'Update state with latest census data' })
  @ApiResponse({ status: 200, type: State })
  async updateStateCensusData(@Param('id') id: string): Promise<State> {
    try {
      console.log(`Starting census data update for state ID: ${id}`);

      // Debug log pro ID
      console.log('Received ID:', id, 'Type:', typeof id);

      const state = await this.statesService.findOne(+id);
      console.log('Found state:', state);

      const stateFips = state.census_metadata?.state_fips;
      console.log('FIPS code:', stateFips);

      if (!stateFips) {
        throw new HttpException(
          `No FIPS code found for state: ${state.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Fetch all census data
      const [demographics, housing, education] = await Promise.all([
        this.censusApiService.getStateDemographics(stateFips).catch((error) => {
          console.error('Demographics fetch error:', error);
          return null;
        }),
        this.censusApiService.getStateHousingData(stateFips).catch((error) => {
          console.error('Housing fetch error:', error);
          return null;
        }),
        this.censusApiService
          .getStateEducationData(stateFips)
          .catch((error) => {
            console.error('Education fetch error:', error);
            return null;
          }),
      ]);

      // Prepare update data with null checks
      const updateData: Partial<State> = {
        ...state,
        census_metadata: {
          state_fips: stateFips,
          last_updated: new Date(),
        },
      };

      if (demographics) {
        updateData.population = demographics.totalPopulation;
        updateData.household_income = demographics.medianHouseholdIncome;
        updateData.unemployment_rate =
          (demographics.unemploymentCount / demographics.totalPopulation) * 100;
      }

      if (housing) {
        updateData.median_home_value = housing.medianHomeValue;
        updateData.median_rent = housing.medianRent;
      }

      if (education) {
        updateData.higher_education_total = education.higherEducationTotal;
        updateData.education_breakdown = education.educationBreakdown;
      }

      console.log('Updating state with data:', updateData);

      // Save the updated state
      try {
        const updatedState = await this.statesService.update(+id, updateData);
        console.log('State updated successfully');
        return updatedState;
      } catch (saveError) {
        console.error('Error saving state:', saveError);
        throw new HttpException(
          `Failed to save state data: ${saveError.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      console.error('Controller Error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to update census data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('census/update-all')
  @ApiOperation({ summary: 'Update all states with latest census data' })
  @ApiResponse({ status: 200, type: [State] })
  async updateAllStatesCensusData(): Promise<State[]> {
    const states = await this.statesService.findAll();
    const updatedStates = await Promise.all(
      states.map((state) => this.updateStateCensusData(state.id.toString())),
    );
    return updatedStates;
  }
}
