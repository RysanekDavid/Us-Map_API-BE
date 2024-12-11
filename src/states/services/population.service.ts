import { Injectable, Logger } from '@nestjs/common';
import { updateStateData } from '../../utils/json.utils';
import { CensusApiService } from '../census-api.service';

@Injectable()
export class PopulationService {
  private readonly logger = new Logger(PopulationService.name);

  constructor(private readonly censusApiService: CensusApiService) {}

  // Static area data for each state
  private readonly stateAreas: { [key: string]: number } = {
    Alabama: 52420,
    Alaska: 665384,
    Arizona: 113990,
    Arkansas: 53179,
    California: 163695,
    Colorado: 104094,
    Connecticut: 5543,
    Delaware: 2489,
    Florida: 65758,
    Georgia: 59425,
    Hawaii: 10932,
    Idaho: 83569,
    Illinois: 57914,
    Indiana: 36420,
    Iowa: 56273,
    Kansas: 82278,
    Kentucky: 40408,
    Louisiana: 52378,
    Maine: 35380,
    Maryland: 12406,
    Massachusetts: 10554,
    Michigan: 96714,
    Minnesota: 86936,
    Mississippi: 48432,
    Missouri: 69707,
    Montana: 147040,
    Nebraska: 77348,
    Nevada: 110572,
    'New Hampshire': 9349,
    'New Jersey': 8723,
    'New Mexico': 121590,
    'New York': 54555,
    'North Carolina': 53819,
    'North Dakota': 70698,
    Ohio: 44826,
    Oklahoma: 69899,
    Oregon: 98379,
    Pennsylvania: 46054,
    'Rhode Island': 1545,
    'South Carolina': 32020,
    'South Dakota': 77116,
    Tennessee: 42144,
    Texas: 268596,
    Utah: 84897,
    Vermont: 9616,
    Virginia: 42775,
    Washington: 71298,
    'West Virginia': 24230,
    Wisconsin: 65496,
    Wyoming: 97813,
  };

  private readonly fipsMap: { [key: string]: string } = {
    Alabama: '01',
    Alaska: '02',
    Arizona: '04',
    Arkansas: '05',
    California: '06',
    Colorado: '08',
    Connecticut: '09',
    Delaware: '10',
    Florida: '12',
    Georgia: '13',
    Hawaii: '15',
    Idaho: '16',
    Illinois: '17',
    Indiana: '18',
    Iowa: '19',
    Kansas: '20',
    Kentucky: '21',
    Louisiana: '22',
    Maine: '23',
    Maryland: '24',
    Massachusetts: '25',
    Michigan: '26',
    Minnesota: '27',
    Mississippi: '28',
    Missouri: '29',
    Montana: '30',
    Nebraska: '31',
    Nevada: '32',
    'New Hampshire': '33',
    'New Jersey': '34',
    'New Mexico': '35',
    'New York': '36',
    'North Carolina': '37',
    'North Dakota': '38',
    Ohio: '39',
    Oklahoma: '40',
    Oregon: '41',
    Pennsylvania: '42',
    'Rhode Island': '44',
    'South Carolina': '45',
    'South Dakota': '46',
    Tennessee: '47',
    Texas: '48',
    Utah: '49',
    Vermont: '50',
    Virginia: '51',
    Washington: '53',
    'West Virginia': '54',
    Wisconsin: '55',
    Wyoming: '56',
  };

  async updateStatePopulationAndArea(stateName: string): Promise<any> {
    try {
      this.logger.log(`Starting population update for state: ${stateName}`);

      const fipsCode = this.fipsMap[stateName];
      if (!fipsCode) {
        throw new Error(`No FIPS code found for state: ${stateName}`);
      }

      const population =
        await this.censusApiService.getStatePopulation(fipsCode);
      const area = this.stateAreas[stateName];

      if (!area) {
        throw new Error(`No area data found for state: ${stateName}`);
      }

      // Update JSON file
      await updateStateData({
        name: stateName,
        population,
        area,
      });

      return {
        success: true,
        data: { population, area },
      };
    } catch (error) {
      this.logger.error(
        `Failed to update population data for ${stateName}:`,
        error,
      );
      throw error;
    }
  }

  async updateAllStatesPopulationAndArea(): Promise<any> {
    try {
      const results = [];
      for (const stateName of Object.keys(this.stateAreas)) {
        try {
          const result = await this.updateStatePopulationAndArea(stateName);
          results.push({
            state: stateName,
            success: true,
            data: result.data,
          });
        } catch (error) {
          results.push({
            state: stateName,
            success: false,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      this.logger.error(
        'Failed to update all states population and area:',
        error,
      );
      throw error;
    }
  }
}
