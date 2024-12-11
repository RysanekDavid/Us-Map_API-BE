// src/states/controllers/update.controller.ts
import { Controller, Post, Param, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GovernorService } from '../services/governor.service';
import { GdpService } from '../services/gdp.service';
import { ElectoralVotesService } from '../services/electoral-votes.service';
import { PopulationService } from '../services/population.service';

@ApiTags('updates')
@Controller('updates')
export class UpdateController {
  constructor(
    private readonly governorService: GovernorService,
    private readonly gdpService: GdpService,
    private readonly electoralVotesService: ElectoralVotesService,
    private readonly populationService: PopulationService,
  ) {}

  // Governor endpoints
  @Post('governor/:stateName')
  @ApiOperation({ summary: 'Update governor data for specific state' })
  async updateStateGovernor(@Param('stateName') stateName: string) {
    return this.governorService.updateStateGovernor(stateName);
  }

  @Post('governor/update-all')
  @ApiOperation({ summary: 'Update governor data for all states' })
  async updateAllGovernors() {
    return this.governorService.updateAllGovernors();
  }

  // GDP endpoints
  @Post('gdp/:stateName')
  @ApiOperation({ summary: 'Update GDP data for specific state' })
  async updateStateGdp(@Param('stateName') stateName: string) {
    return this.gdpService.updateStateGdpData(stateName);
  }

  @Post('gdp/update-all')
  @ApiOperation({ summary: 'Update GDP data for all states' })
  async updateAllGdp() {
    return this.gdpService.updateAllGdpData();
  }

  @Get('gdp/stats')
  @ApiOperation({ summary: 'Get GDP statistics' })
  async getGdpStats() {
    return this.gdpService.getGdpStats();
  }

  // Electoral votes endpoints
  @Post('electoral/:stateName')
  @ApiOperation({ summary: 'Update electoral votes for specific state' })
  async updateStateElectoralVotes(@Param('stateName') stateName: string) {
    return this.electoralVotesService.updateStateElectoralVotes(stateName);
  }

  @Post('electoral/update-all')
  @ApiOperation({ summary: 'Update electoral votes for all states' })
  async updateAllElectoralVotes() {
    return this.electoralVotesService.updateAllElectoralVotes();
  }

  // Population endpoints
  @Post('population/:stateName')
  @ApiOperation({ summary: 'Update population data for specific state' })
  async updateStatePopulation(@Param('stateName') stateName: string) {
    return this.populationService.updateStatePopulationAndArea(stateName);
  }

  @Post('population/update-all')
  @ApiOperation({ summary: 'Update population data for all states' })
  async updateAllPopulation() {
    return this.populationService.updateAllStatesPopulationAndArea();
  }

  // Update all data at once
  @Post('update-all')
  @ApiOperation({ summary: 'Update all data for all states' })
  async updateAllData() {
    const governors = await this.governorService.updateAllGovernors();
    const gdp = await this.gdpService.updateAllGdpData();
    const electoral =
      await this.electoralVotesService.updateAllElectoralVotes();
    const population =
      await this.populationService.updateAllStatesPopulationAndArea();

    return {
      governors,
      gdp,
      electoral,
      population,
    };
  }
}
