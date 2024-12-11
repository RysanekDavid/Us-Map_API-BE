// src/scripts/update-single.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { GovernorService } from '../states/services/governor.service';
import { GdpService } from '../states/services/gdp.service';
import { ElectoralVotesService } from '../states/services/electoral-votes.service';

async function updateSingle(type: string) {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);

    switch (type) {
      case 'governor':
        const governorService = app.get(GovernorService);
        console.log('Updating governors...');
        await governorService.updateAllGovernors();
        break;

      case 'electoral':
        const electoralService = app.get(ElectoralVotesService);
        console.log('Updating electoral votes...');
        await electoralService.updateAllElectoralVotes();
        break;

      case 'gdp':
        const gdpService = app.get(GdpService);
        console.log('Updating GDP data...');
        await gdpService.updateAllGdpData();
        break;

      default:
        throw new Error(`Unknown update type: ${type}`);
    }

    await app.close();
  } catch (error) {
    console.error(`Failed to update ${type}:`, error);
    process.exit(1);
  }
}

// Získání typu aktualizace z argumentů příkazové řádky
const updateType = process.argv[2];
if (!updateType) {
  console.error('Please specify update type: governor, electoral, or gdp');
  process.exit(1);
}

updateSingle(updateType);
