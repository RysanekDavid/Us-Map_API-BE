// src/database/seeds/test-data.seed.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from '../../states/entities/state.entity';
import { PoliticalStatus } from '../../states/entities/state.entity';

interface StateInitialData {
  name: string;
  abbreviation: string;
  capital: string;
  fips: string;
  political_status: PoliticalStatus;
}

@Injectable()
export class TestDataSeeder {
  private readonly logger = new Logger(TestDataSeeder.name);

  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
  ) {}

  private readonly statesData: StateInitialData[] = [
    {
      name: 'Alabama',
      abbreviation: 'AL',
      capital: 'Montgomery',
      fips: '01',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Alaska',
      abbreviation: 'AK',
      capital: 'Juneau',
      fips: '02',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Arizona',
      abbreviation: 'AZ',
      capital: 'Phoenix',
      fips: '04',
      political_status: PoliticalStatus.LEAN_REP,
    },
    {
      name: 'Arkansas',
      abbreviation: 'AR',
      capital: 'Little Rock',
      fips: '05',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'California',
      abbreviation: 'CA',
      capital: 'Sacramento',
      fips: '06',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'Colorado',
      abbreviation: 'CO',
      capital: 'Denver',
      fips: '08',
      political_status: PoliticalStatus.LEAN_DEM,
    },
    {
      name: 'Connecticut',
      abbreviation: 'CT',
      capital: 'Hartford',
      fips: '09',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'Delaware',
      abbreviation: 'DE',
      capital: 'Dover',
      fips: '10',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'Florida',
      abbreviation: 'FL',
      capital: 'Tallahassee',
      fips: '12',
      political_status: PoliticalStatus.LEAN_REP,
    },
    {
      name: 'Georgia',
      abbreviation: 'GA',
      capital: 'Atlanta',
      fips: '13',
      political_status: PoliticalStatus.SWING,
    },
    {
      name: 'Hawaii',
      abbreviation: 'HI',
      capital: 'Honolulu',
      fips: '15',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'Idaho',
      abbreviation: 'ID',
      capital: 'Boise',
      fips: '16',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Illinois',
      abbreviation: 'IL',
      capital: 'Springfield',
      fips: '17',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'Indiana',
      abbreviation: 'IN',
      capital: 'Indianapolis',
      fips: '18',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Iowa',
      abbreviation: 'IA',
      capital: 'Des Moines',
      fips: '19',
      political_status: PoliticalStatus.LEAN_REP,
    },
    {
      name: 'Kansas',
      abbreviation: 'KS',
      capital: 'Topeka',
      fips: '20',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Kentucky',
      abbreviation: 'KY',
      capital: 'Frankfort',
      fips: '21',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Louisiana',
      abbreviation: 'LA',
      capital: 'Baton Rouge',
      fips: '22',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Maine',
      abbreviation: 'ME',
      capital: 'Augusta',
      fips: '23',
      political_status: PoliticalStatus.LEAN_DEM,
    },
    {
      name: 'Maryland',
      abbreviation: 'MD',
      capital: 'Annapolis',
      fips: '24',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'Massachusetts',
      abbreviation: 'MA',
      capital: 'Boston',
      fips: '25',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'Michigan',
      abbreviation: 'MI',
      capital: 'Lansing',
      fips: '26',
      political_status: PoliticalStatus.LEAN_DEM,
    },
    {
      name: 'Minnesota',
      abbreviation: 'MN',
      capital: 'St. Paul',
      fips: '27',
      political_status: PoliticalStatus.LEAN_DEM,
    },
    {
      name: 'Mississippi',
      abbreviation: 'MS',
      capital: 'Jackson',
      fips: '28',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Missouri',
      abbreviation: 'MO',
      capital: 'Jefferson City',
      fips: '29',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Montana',
      abbreviation: 'MT',
      capital: 'Helena',
      fips: '30',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Nebraska',
      abbreviation: 'NE',
      capital: 'Lincoln',
      fips: '31',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Nevada',
      abbreviation: 'NV',
      capital: 'Carson City',
      fips: '32',
      political_status: PoliticalStatus.LEAN_DEM,
    },
    {
      name: 'New Hampshire',
      abbreviation: 'NH',
      capital: 'Concord',
      fips: '33',
      political_status: PoliticalStatus.SWING,
    },
    {
      name: 'New Jersey',
      abbreviation: 'NJ',
      capital: 'Trenton',
      fips: '34',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'New Mexico',
      abbreviation: 'NM',
      capital: 'Santa Fe',
      fips: '35',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'New York',
      abbreviation: 'NY',
      capital: 'Albany',
      fips: '36',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'North Carolina',
      abbreviation: 'NC',
      capital: 'Raleigh',
      fips: '37',
      political_status: PoliticalStatus.SWING,
    },
    {
      name: 'North Dakota',
      abbreviation: 'ND',
      capital: 'Bismarck',
      fips: '38',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Ohio',
      abbreviation: 'OH',
      capital: 'Columbus',
      fips: '39',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Oklahoma',
      abbreviation: 'OK',
      capital: 'Oklahoma City',
      fips: '40',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Oregon',
      abbreviation: 'OR',
      capital: 'Salem',
      fips: '41',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'Pennsylvania',
      abbreviation: 'PA',
      capital: 'Harrisburg',
      fips: '42',
      political_status: PoliticalStatus.SWING,
    },
    {
      name: 'Rhode Island',
      abbreviation: 'RI',
      capital: 'Providence',
      fips: '44',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'South Carolina',
      abbreviation: 'SC',
      capital: 'Columbia',
      fips: '45',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'South Dakota',
      abbreviation: 'SD',
      capital: 'Pierre',
      fips: '46',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Tennessee',
      abbreviation: 'TN',
      capital: 'Nashville',
      fips: '47',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Texas',
      abbreviation: 'TX',
      capital: 'Austin',
      fips: '48',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Utah',
      abbreviation: 'UT',
      capital: 'Salt Lake City',
      fips: '49',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Vermont',
      abbreviation: 'VT',
      capital: 'Montpelier',
      fips: '50',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'Virginia',
      abbreviation: 'VA',
      capital: 'Richmond',
      fips: '51',
      political_status: PoliticalStatus.LEAN_DEM,
    },
    {
      name: 'Washington',
      abbreviation: 'WA',
      capital: 'Olympia',
      fips: '53',
      political_status: PoliticalStatus.SOLID_DEM,
    },
    {
      name: 'West Virginia',
      abbreviation: 'WV',
      capital: 'Charleston',
      fips: '54',
      political_status: PoliticalStatus.SOLID_REP,
    },
    {
      name: 'Wisconsin',
      abbreviation: 'WI',
      capital: 'Madison',
      fips: '55',
      political_status: PoliticalStatus.SWING,
    },
    {
      name: 'Wyoming',
      abbreviation: 'WY',
      capital: 'Cheyenne',
      fips: '56',
      political_status: PoliticalStatus.SOLID_REP,
    },
  ];

  async seed() {
    try {
      this.logger.log('Starting state seeding...');

      // Nejprve zkontrolujeme, zda tabulka existuje
      const tableExists = await this.checkTableExists();
      if (!tableExists) {
        this.logger.log(
          'States table does not exist, waiting for synchronization...',
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Vyčistíme existující data pouze pokud tabulka existuje
      if (await this.checkTableExists()) {
        await this.clearExistingData();
      }

      for (const stateData of this.statesData) {
        try {
          const existingState = await this.stateRepository.findOne({
            where: { abbreviation: stateData.abbreviation },
          });

          if (!existingState) {
            const state = this.stateRepository.create({
              name: stateData.name,
              abbreviation: stateData.abbreviation,
              capital: stateData.capital,
              political_status: stateData.political_status,
              population: 0,
              census_metadata: {
                state_fips: stateData.fips,
                last_updated: null,
              },
            });

            await this.stateRepository.save(state);
            this.logger.log(
              `Created state: ${stateData.name} with FIPS: ${stateData.fips}`,
            );
          }
        } catch (error) {
          this.logger.error(
            `Failed to create state ${stateData.name}:`,
            error.message,
          );
          throw error;
        }
      }

      this.logger.log('State seeding completed successfully');
      return {
        success: true,
        message: 'States seeded successfully',
        count: this.statesData.length,
      };
    } catch (error) {
      this.logger.error('Failed to seed states:', error.message);
      this.logger.error('Stack trace:', error.stack);
      throw error;
    }
  }

  private async checkTableExists(): Promise<boolean> {
    try {
      const tableExists = await this.stateRepository.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public'
                    AND table_name = 'states'
                );
            `);
      return tableExists[0].exists;
    } catch (error) {
      this.logger.error('Failed to check table existence:', error.message);
      return false;
    }
  }

  private async clearExistingData() {
    try {
      this.logger.log('Clearing existing data...');
      await this.stateRepository.query(
        'TRUNCATE TABLE states RESTART IDENTITY CASCADE',
      );
      this.logger.log('Existing data cleared successfully');
    } catch (error) {
      this.logger.error('Failed to clear existing data:', error.message);
      throw error;
    }
  }
}
