import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { updateStateData } from '../../utils/json.utils';
import * as path from 'path';
import { readJsonFile } from '../../utils/json.utils';
import { StateResponse } from '../entities/state.entity';

interface WikiGDPData {
  rank: number;
  gdp: number;
  gdpPerCapita: number;
}

@Injectable()
export class GdpService {
  private readonly logger = new Logger(GdpService.name);
  private wikiDataCache: Map<string, WikiGDPData> | null = null;

  async updateStateGdpData(stateName: string): Promise<any> {
    try {
      this.logger.log(`Starting GDP update for state: ${stateName}`);

      // Initialize cache if needed
      if (!this.wikiDataCache) {
        await this.initializeWikiData();
      }

      const wikiData = this.wikiDataCache?.get(stateName);
      if (!wikiData) {
        throw new Error(`No Wikipedia data found for state: ${stateName}`);
      }

      // Update JSON file
      await updateStateData({
        name: stateName,
        gdp: wikiData.gdp,
        gdp_per_capita: wikiData.gdpPerCapita,
        gdp_rank: wikiData.rank,
      });

      return {
        success: true,
        data: wikiData,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update GDP data for state ${stateName}:`,
        error,
      );
      throw error;
    }
  }

  async updateAllGdpData() {
    try {
      if (!this.wikiDataCache) {
        await this.initializeWikiData();
      }

      const results = [];
      for (const [stateName, gdpData] of this.wikiDataCache.entries()) {
        try {
          await this.updateStateGdpData(stateName);
          results.push({
            state: stateName,
            success: true,
            data: gdpData,
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
      this.logger.error('Failed to update GDP data for all states:', error);
      throw error;
    }
  }

  async getGdpStats() {
    try {
      const data = await readJsonFile<StateResponse>(
        path.join(__dirname, '../../../data/states.json'),
      );

      const validStates = data.states.filter((state) => state.gdp);
      const gdpValues = validStates.map((state) => Number(state.gdp));

      const total = gdpValues.reduce((sum, gdp) => sum + gdp, 0);
      const average = total / gdpValues.length;

      const sortedStates = [...validStates].sort(
        (a, b) => Number(b.gdp) - Number(a.gdp),
      );

      return {
        total,
        average,
        highest: {
          state: sortedStates[0].name,
          gdp: sortedStates[0].gdp,
        },
        lowest: {
          state: sortedStates[sortedStates.length - 1].name,
          gdp: sortedStates[sortedStates.length - 1].gdp,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get GDP statistics:', error);
      throw error;
    }
  }

  private async initializeWikiData(): Promise<void> {
    try {
      this.logger.log('Fetching GDP data from Wikipedia...');
      const response = await axios.get(
        'https://en.wikipedia.org/wiki/List_of_U.S._states_and_territories_by_GDP',
      );

      const $ = cheerio.load(response.data);
      this.wikiDataCache = new Map<string, WikiGDPData>();

      const rows = $('table.wikitable').first().find('tr').toArray();
      const parsedData: {
        stateName: string;
        gdp: number;
        gdpPerCapita: number;
      }[] = [];

      // Parse table rows
      rows.forEach((row, i) => {
        if (i === 0) return; // Skip header row

        const columns = $(row).find('td');
        if (columns.length >= 4) {
          const stateName = $(columns[0]).find('a').first().text().trim();
          if (
            !stateName ||
            stateName.toLowerCase().includes('total') ||
            stateName.toLowerCase().includes('territory')
          ) {
            return;
          }

          const gdpText = $(columns[1]).text().replace(/[\$,]/g, '').trim();
          const gdpPerCapitaText = $(columns[2])
            .text()
            .replace(/[\$,]/g, '')
            .trim();

          const gdp = parseFloat(gdpText) * 1000000; // GDP in millions
          const gdpPerCapita = parseFloat(gdpPerCapitaText);

          if (!isNaN(gdp) && !isNaN(gdpPerCapita)) {
            parsedData.push({ stateName, gdp, gdpPerCapita });
          }
        }
      });

      // Sort by GDP in descending order and assign rank
      parsedData
        .sort((a, b) => b.gdp - a.gdp)
        .forEach((item, index) => {
          this.wikiDataCache.set(item.stateName, {
            rank: index + 1,
            gdp: item.gdp,
            gdpPerCapita: item.gdpPerCapita,
          });

          this.logger.debug(
            `Loaded data for ${item.stateName}: Rank=${index + 1}, GDP=${item.gdp}, Per Capita=${item.gdpPerCapita}`,
          );
        });

      this.logger.log(`Loaded GDP data for ${this.wikiDataCache.size} states`);
    } catch (error) {
      this.logger.error('Failed to fetch Wikipedia data:', error);
      throw error;
    }
  }
}
