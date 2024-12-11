import { Injectable, Logger } from '@nestjs/common';
import { GovernorParty } from '../entities/state.entity';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { updateStateData } from '../../utils/json.utils';

interface GovernorData {
  name: string;
  party: GovernorParty;
}

@Injectable()
export class GovernorService {
  private readonly logger = new Logger(GovernorService.name);
  private governorDataCache: Map<string, GovernorData> | null = null;

  async updateStateGovernor(stateName: string): Promise<any> {
    try {
      this.logger.log(`Starting Governor update for state: ${stateName}`);

      // Initialize cache if needed
      if (!this.governorDataCache) {
        await this.initializeGovernorData();
      }

      // Special handling for D.C.
      if (stateName === 'District of Columbia') {
        const dcData = {
          name: 'Muriel Bowser',
          party: GovernorParty.DEMOCRAT,
        };

        await updateStateData({
          name: stateName,
          governor_name: dcData.name,
          governor_party: dcData.party,
        });

        return {
          success: true,
          data: dcData,
        };
      }

      const governorData = this.governorDataCache?.get(stateName);
      if (!governorData) {
        throw new Error(`No Governor data found for state: ${stateName}`);
      }

      // Update JSON file
      await updateStateData({
        name: stateName,
        governor_name: governorData.name,
        governor_party: governorData.party,
      });

      return {
        success: true,
        data: governorData,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update Governor data for ${stateName}:`,
        error,
      );
      throw error;
    }
  }

  async updateAllGovernors() {
    try {
      if (!this.governorDataCache) {
        await this.initializeGovernorData();
      }

      const results = [];
      for (const [
        stateName,
        governorData,
      ] of this.governorDataCache.entries()) {
        try {
          await this.updateStateGovernor(stateName);
          results.push({
            state: stateName,
            success: true,
            data: {
              governor: governorData.name,
              party: governorData.party,
            },
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
        'Failed to update Governor data for all states:',
        error,
      );
      throw error;
    }
  }

  private async initializeGovernorData(): Promise<void> {
    try {
      this.logger.log('Fetching Governor data from Wikipedia...');
      const response = await axios.get(
        'https://en.wikipedia.org/wiki/List_of_current_United_States_governors',
      );

      const $ = cheerio.load(response.data);
      this.governorDataCache = new Map<string, GovernorData>();

      // Find all governor rows in the table
      $('table.wikitable')
        .first()
        .find('tr')
        .each((i, row) => {
          if (i === 0) return; // Skip header row

          // Get state name and remove ' (list)' suffix
          const stateText = $(row).find('td').first().text().trim();
          const stateName = stateText.replace(/ \(list\)$/, '');

          // Special case for Louisiana
          if (stateName === 'Louisiana') {
            this.governorDataCache.set(stateName, {
              name: 'Jeff Landry',
              party: GovernorParty.REPUBLICAN,
            });
            return;
          }

          // Get governor name from data-sort-value
          const governorSpan = $(row).find('span[data-sort-value]').first();
          const governorName =
            governorSpan.attr('data-sort-value')?.trim() || '';

          // Get party from background color cell
          const partyText = $(row).find('td').eq(3).text().trim();
          let party = null;
          if (partyText.toLowerCase().includes('democratic')) {
            party = GovernorParty.DEMOCRAT;
          } else if (partyText.toLowerCase().includes('republican')) {
            party = GovernorParty.REPUBLICAN;
          }

          if (stateName && party) {
            this.governorDataCache.set(stateName, {
              name: governorName || 'Unknown',
              party: party,
            });

            this.logger.debug(
              `Loaded Governor data for ${stateName}: ${governorName} (${party})`,
            );
          }
        });

      this.logger.log(
        `Loaded Governor data for ${this.governorDataCache.size} states`,
      );

      // Debug log all loaded data
      for (const [state, data] of this.governorDataCache.entries()) {
        this.logger.debug(`${state}: ${data.name} (${data.party})`);
      }
    } catch (error) {
      this.logger.error('Failed to fetch Governor data from Wikipedia:', error);
      throw error;
    }
  }
}
