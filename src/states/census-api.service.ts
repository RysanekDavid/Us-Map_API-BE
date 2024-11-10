// src/states/census-api.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CensusApiService {
  private readonly API_KEY = 'a5d8d6bb4a5cc5cc91706960e4b2475bf0d9c8dc';
  private readonly BASE_URL = 'https://api.census.gov/data';
  private readonly CURRENT_YEAR = '2021'; // Using 2021 as most recent available data

  private async makeRequest(params: any) {
    try {
      console.log('Making Census API request with params:', params);
      const url = `${this.BASE_URL}/${this.CURRENT_YEAR}/acs/acs1`;
      const response = await axios.get(url, { params });
      console.log('Census API response:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Census API request failed:',
        error.response?.data || error.message,
      );
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          `Census API error: ${error.response?.data || error.message}`,
          error.response?.status || HttpStatus.BAD_GATEWAY,
        );
      }
      throw error;
    }
  }

  async getStateDemographics(stateId: string) {
    console.log(`Fetching demographics for state ID: ${stateId}`);
    try {
      const params = {
        get: 'NAME,B01003_001E,B19013_001E,B23025_005E',
        for: `state:${stateId}`,
        key: this.API_KEY,
      };

      const [headers, ...data] = await this.makeRequest(params);
      if (!data || data.length === 0) {
        throw new HttpException(
          'No data returned from Census API',
          HttpStatus.NOT_FOUND,
        );
      }

      const row = data[0];
      return {
        name: row[headers.indexOf('NAME')],
        totalPopulation: parseInt(row[headers.indexOf('B01003_001E')]) || 0,
        medianHouseholdIncome:
          parseInt(row[headers.indexOf('B19013_001E')]) || 0,
        unemploymentCount: parseInt(row[headers.indexOf('B23025_005E')]) || 0,
      };
    } catch (error) {
      console.error(
        `Failed to fetch demographics for state ${stateId}:`,
        error,
      );
      throw error;
    }
  }

  async getStateHousingData(stateId: string) {
    console.log(`Fetching housing data for state ID: ${stateId}`);
    try {
      const params = {
        get: 'NAME,B25077_001E,B25064_001E',
        for: `state:${stateId}`,
        key: this.API_KEY,
      };

      const [headers, ...data] = await this.makeRequest(params);
      if (!data || data.length === 0) {
        throw new HttpException(
          'No data returned from Census API',
          HttpStatus.NOT_FOUND,
        );
      }

      const row = data[0];
      return {
        name: row[headers.indexOf('NAME')],
        medianHomeValue: parseInt(row[headers.indexOf('B25077_001E')]) || 0,
        medianRent: parseInt(row[headers.indexOf('B25064_001E')]) || 0,
      };
    } catch (error) {
      console.error(
        `Failed to fetch housing data for state ${stateId}:`,
        error,
      );
      throw error;
    }
  }

  async getStateEducationData(stateId: string) {
    console.log(`Fetching education data for state ID: ${stateId}`);
    try {
      const params = {
        get: 'NAME,B15003_022E,B15003_023E,B15003_024E,B15003_025E',
        for: `state:${stateId}`,
        key: this.API_KEY,
      };

      const [headers, ...data] = await this.makeRequest(params);
      if (!data || data.length === 0) {
        throw new HttpException(
          'No data returned from Census API',
          HttpStatus.NOT_FOUND,
        );
      }

      const row = data[0];
      const bachelors = parseInt(row[headers.indexOf('B15003_022E')]) || 0;
      const masters = parseInt(row[headers.indexOf('B15003_023E')]) || 0;
      const professional = parseInt(row[headers.indexOf('B15003_024E')]) || 0;
      const doctorate = parseInt(row[headers.indexOf('B15003_025E')]) || 0;

      return {
        name: row[headers.indexOf('NAME')],
        higherEducationTotal: bachelors + masters + professional + doctorate,
        educationBreakdown: {
          bachelors,
          masters,
          professional,
          doctorate,
        },
      };
    } catch (error) {
      console.error(
        `Failed to fetch education data for state ${stateId}:`,
        error,
      );
      throw error;
    }
  }
}
