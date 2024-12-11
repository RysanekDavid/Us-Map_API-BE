// src/scripts/export-to-json.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import * as fs from 'fs';
import * as path from 'path';

// Přidáme zkratky států
const stateAbbreviations: { [key: string]: string } = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
};

// Přidáme politické statusy podle registračních dat
const statePoliticalStatus: { [key: string]: string } = {
  // Solid Democratic (výrazně více DEM registrací)
  California: 'solid-dem',
  Oregon: 'solid-dem',
  Washington: 'solid-dem',
  Hawaii: 'solid-dem',
  Illinois: 'solid-dem',
  Maryland: 'solid-dem',
  Massachusetts: 'solid-dem',
  'New York': 'solid-dem',
  'New Jersey': 'solid-dem',
  Connecticut: 'solid-dem',
  'Rhode Island': 'solid-dem',
  Delaware: 'solid-dem',
  Vermont: 'solid-dem',

  // Lean Democratic
  Maine: 'lean-dem',
  'New Mexico': 'lean-dem',
  Colorado: 'lean-dem',
  Virginia: 'lean-dem',
  Minnesota: 'lean-dem',

  // Swing States
  Nevada: 'swing',
  Arizona: 'swing',
  Wisconsin: 'swing',
  Michigan: 'swing',
  Pennsylvania: 'swing',
  'New Hampshire': 'swing',
  Georgia: 'swing',
  'North Carolina': 'swing',

  // Lean Republican
  Florida: 'lean-rep',
  Texas: 'lean-rep',
  Ohio: 'lean-rep',
  Iowa: 'lean-rep',

  // Solid Republican (výrazně více REP registrací)
  Idaho: 'solid-rep',
  Montana: 'solid-rep',
  Wyoming: 'solid-rep',
  Utah: 'solid-rep',
  'North Dakota': 'solid-rep',
  'South Dakota': 'solid-rep',
  Nebraska: 'solid-rep',
  Kansas: 'solid-rep',
  Oklahoma: 'solid-rep',
  Missouri: 'solid-rep',
  Arkansas: 'solid-rep',
  Louisiana: 'solid-rep',
  Mississippi: 'solid-rep',
  Alabama: 'solid-rep',
  Tennessee: 'solid-rep',
  Kentucky: 'solid-rep',
  Indiana: 'solid-rep',
  'West Virginia': 'solid-rep',
  'South Carolina': 'solid-rep',
  Alaska: 'solid-rep',
};

async function exportToJson() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataPath = path.join(__dirname, '../../data/states.json');

    // Načíst existující data
    let data;
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      data = JSON.parse(fileContent);

      // Přidat zkratky států a politické statusy
      data.states = data.states.map((state) => ({
        ...state,
        abbreviation: stateAbbreviations[state.name] || '',
        political_status: statePoliticalStatus[state.name] || 'swing',
      }));

      // Aktualizovat timestamp
      data.lastUpdated = new Date().toISOString();
    } else {
      throw new Error('states.json not found! Run monthly-update first.');
    }

    // Zapsat aktualizovaná data
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    console.log('Data exported successfully to:', dataPath);
    await app.close();
  } catch (error) {
    console.error('Failed to export data:', error);
    process.exit(1);
  }
}

exportToJson();
