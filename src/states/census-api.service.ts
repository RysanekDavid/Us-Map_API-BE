// src/states/census-api.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CensusApiService {
  private readonly API_KEY = 'a5d8d6bb4a5cc5cc91706960e4b2475bf0d9c8dc';
  private readonly BASE_URL = 'https://api.census.gov/data';
  private readonly CURRENT_YEAR = '2021';

  private async makeRequest(url: string, params: any) {
    try {
      const response = await axios.get(url, { params });
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

  async getStatePopulation(stateFips: string): Promise<number> {
    console.log(`Fetching population for state FIPS: ${stateFips}`);
    try {
      const url = `${this.BASE_URL}/${this.CURRENT_YEAR}/pep/population`;
      const params = {
        get: 'POP_2021',
        for: `state:${stateFips}`,
        key: this.API_KEY,
      };

      const [headers, ...data] = await this.makeRequest(url, params);

      if (!data || data.length === 0) {
        throw new HttpException(
          'No data returned from Census API',
          HttpStatus.NOT_FOUND,
        );
      }

      const row = data[0];
      const populationIndex = headers.indexOf('POP_2021');
      const population = parseInt(row[populationIndex], 10) || 0;

      return population;
    } catch (error) {
      console.error(
        `Failed to fetch population for state FIPS ${stateFips}:`,
        error,
      );
      throw error;
    }
  }

  async getStateArea(stateFips: string): Promise<number> {
    console.log(`Fetching area for state FIPS: ${stateFips}`);
    try {
      const url = `${this.BASE_URL}/2023/geoinfo`;
      const params = {
        get: 'NAME,AREALAND',
        for: `state:${stateFips}`,
        key: this.API_KEY,
      };

      const [headers, ...data] = await this.makeRequest(url, params);

      if (!data || data.length === 0) {
        throw new HttpException(
          'No data returned from Census API',
          HttpStatus.NOT_FOUND,
        );
      }

      const row = data[0];
      const areaLandIndex = headers.indexOf('AREALAND');
      const areaLand = parseFloat(row[areaLandIndex]) || 0;

      // Převod z metrů čtverečních na kilometry čtvereční
      const areaInSquareKm = areaLand / 1_000_000;

      return areaInSquareKm;
    } catch (error) {
      console.error(`Failed to fetch area for state FIPS ${stateFips}:`, error);
      throw error;
    }
  }
}
