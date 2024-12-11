// src/states/services/electoral-votes.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { updateStateData } from '../../utils/json.utils';

@Injectable()
export class ElectoralVotesService {
  private readonly logger = new Logger(ElectoralVotesService.name);
  private electoralVotesCache: Map<string, number> | null = null;

  async updateStateElectoralVotes(stateName: string): Promise<any> {
    try {
      this.logger.log(
        `Starting Electoral Votes update for state: ${stateName}`,
      );

      if (!this.electoralVotesCache) {
        await this.initializeElectoralVotesData();
      }

      const votes = this.electoralVotesCache?.get(stateName);
      if (!votes && votes !== 0) {
        throw new Error(`No Electoral Votes found for state: ${stateName}`);
      }

      // Update JSON file
      await updateStateData({
        name: stateName,
        electoral_votes: votes,
      });

      return {
        success: true,
        data: { electoral_votes: votes },
      };
    } catch (error) {
      this.logger.error(
        `Failed to update Electoral Votes for state ${stateName}:`,
        error,
      );
      throw error;
    }
  }

  async updateAllElectoralVotes() {
    try {
      if (!this.electoralVotesCache) {
        await this.initializeElectoralVotesData();
      }

      const results = [];
      for (const [stateName, votes] of this.electoralVotesCache.entries()) {
        try {
          await this.updateStateElectoralVotes(stateName);
          results.push({
            state: stateName,
            success: true,
            data: { electoral_votes: votes },
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
      this.logger.error('Failed to update all Electoral Votes:', error);
      throw error;
    }
  }

  private async initializeElectoralVotesData(): Promise<void> {
    try {
      this.logger.log('Fetching Electoral Votes data from archives.gov...');
      const response = await axios.get(
        'https://www.archives.gov/electoral-college/allocation',
      );

      const $ = cheerio.load(response.data);
      this.electoralVotesCache = new Map<string, number>();

      // Look for table cells containing state votes pattern
      $('td p').each((_, element) => {
        const text = $(element).text().trim();
        const match = text.match(/^(.+)\s*-\s*(\d+)\s*votes?$/);

        if (match) {
          const state = match[1].trim();
          const votes = parseInt(match[2], 10);

          if (state && !isNaN(votes)) {
            this.electoralVotesCache.set(state, votes);
            this.logger.debug(`Loaded Electoral Votes for ${state}: ${votes}`);
          }
        }
      });

      // Speciální případy
      if (!this.electoralVotesCache.has('District of Columbia')) {
        this.electoralVotesCache.set('District of Columbia', 3);
      }

      this.logger.log(
        `Loaded Electoral Votes for ${this.electoralVotesCache.size} states`,
      );

      // Debug log všech načtených dat
      for (const [state, votes] of this.electoralVotesCache.entries()) {
        this.logger.debug(`${state}: ${votes} electoral votes`);
      }
    } catch (error) {
      this.logger.error('Failed to fetch Electoral Votes data:', error);
      throw error;
    }
  }
}
