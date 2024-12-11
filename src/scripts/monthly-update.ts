// src/scripts/monthly-update.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { GovernorService } from '../states/services/governor.service';
import { GdpService } from '../states/services/gdp.service';
import { ElectoralVotesService } from '../states/services/electoral-votes.service';
import { PopulationService } from '../states/services/population.service';
import * as fs from 'fs';
import * as path from 'path';

async function monthlyUpdate() {
  console.log('Starting monthly data update...');
  const startTime = new Date();

  try {
    const app = await NestFactory.createApplicationContext(AppModule);

    // Získání služeb
    const governorService = app.get(GovernorService);
    const gdpService = app.get(GdpService);
    const electoralVotesService = app.get(ElectoralVotesService);
    const populationService = app.get(PopulationService);

    // Provedení aktualizací
    console.log('1/4 Updating governors...');
    const governorResults = await governorService.updateAllGovernors();

    console.log('2/4 Updating electoral votes...');
    const electoralResults =
      await electoralVotesService.updateAllElectoralVotes();

    console.log('3/4 Updating GDP data...');
    const gdpResults = await gdpService.updateAllGdpData();

    console.log('4/4 Updating population data...');
    const populationResults =
      await populationService.updateAllStatesPopulationAndArea();

    // Vytvoření metadata o aktualizaci
    const updateInfo = {
      lastUpdated: new Date().toISOString(),
      metadata: {
        lastUpdateDuration: `${(new Date().getTime() - startTime.getTime()) / 1000} seconds`,
        governorsUpdated: governorResults.filter((r) => r.success).length,
        electoralVotesUpdated: electoralResults.filter((r) => r.success).length,
        gdpUpdated: gdpResults.filter((r) => r.success).length,
        populationUpdated: populationResults.filter((r) => r.success).length,
      },
    };

    // Uložení informací o aktualizaci do samostatného souboru
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(dataDir, 'update-info.json'),
      JSON.stringify(updateInfo, null, 2),
    );

    console.log('✅ Update completed successfully!');
    console.log('Update duration:', updateInfo.metadata.lastUpdateDuration);
    console.log(`Updated:
      ${updateInfo.metadata.governorsUpdated} governors, 
      ${updateInfo.metadata.electoralVotesUpdated} electoral votes, 
      ${updateInfo.metadata.gdpUpdated} GDP records,
      ${updateInfo.metadata.populationUpdated} population records`);

    await app.close();
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

monthlyUpdate();
