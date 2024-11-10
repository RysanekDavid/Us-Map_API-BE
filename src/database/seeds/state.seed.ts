// src/database/seeds/state.seed.ts
import axios from 'axios';
import { StateDataInterface } from '../interfaces/state-data.interface';
import { PoliticalStatus } from '../../states/entities/state.entity';

const stateCapitals: { [key: string]: string } = {
  California: 'Sacramento',
  Texas: 'Austin',
  Florida: 'Tallahassee',
  'New York': 'Albany',
  Illinois: 'Springfield',
  Pennsylvania: 'Harrisburg',
  Ohio: 'Columbus',
  Georgia: 'Atlanta',
  Michigan: 'Lansing',
  'North Carolina': 'Raleigh',
};

const statePoliticalStatus: { [key: string]: PoliticalStatus } = {
  California: PoliticalStatus.SOLID_DEM,
  Texas: PoliticalStatus.SOLID_REP,
  Florida: PoliticalStatus.LEAN_REP,
  'New York': PoliticalStatus.SOLID_DEM,
  Illinois: PoliticalStatus.SOLID_DEM,
  Pennsylvania: PoliticalStatus.SWING,
  Ohio: PoliticalStatus.LEAN_REP,
  Georgia: PoliticalStatus.SWING,
  Michigan: PoliticalStatus.LEAN_DEM,
  'North Carolina': PoliticalStatus.LEAN_REP,
};

const getStateCapital = (stateName: string): string => {
  return stateCapitals[stateName] || 'Unknown';
};

const getStatePoliticalStatus = (stateName: string): PoliticalStatus => {
  return statePoliticalStatus[stateName] || PoliticalStatus.SWING;
};

const getStateAbbreviation = (stateName: string): string => {
  const abbreviations: { [key: string]: string } = {
    California: 'CA',
    Texas: 'TX',
    Florida: 'FL',
    'New York': 'NY',
    Illinois: 'IL',
    Pennsylvania: 'PA',
    Ohio: 'OH',
    Georgia: 'GA',
    Michigan: 'MI',
    'North Carolina': 'NC',
  };
  return abbreviations[stateName] || 'UN';
};

export const getStatesData = async (): Promise<StateDataInterface[]> => {
  try {
    console.log('Fetching population data...');
    const populationResponse = await axios.get(
      'https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest',
    );

    console.log('Fetching income data...');
    const incomeResponse = await axios.get(
      'https://datausa.io/api/data?drilldowns=State&measures=Household%20Income&year=latest',
    );

    console.log('Fetching unemployment data...');
    const unemploymentResponse = await axios.get(
      'https://datausa.io/api/data?drilldowns=State&measures=Unemployment%20Rate&year=latest',
    );

    console.log('Processing state data...');
    const statesData = populationResponse.data.data.map((state: any) => {
      console.log(`Processing state: ${state.State}`);

      const incomeData = incomeResponse.data.data.find(
        (income: any) => income.State === state.State,
      );
      const unemploymentData = unemploymentResponse.data.data.find(
        (unemployment: any) => unemployment.State === state.State,
      );

      const stateData: StateDataInterface = {
        name: state.State,
        abbreviation: getStateAbbreviation(state.State),
        capital: getStateCapital(state.State),
        population: parseInt(state.Population) || 0,
        political_status: getStatePoliticalStatus(state.State),
        household_income: incomeData
          ? parseInt(incomeData['Household Income']) || null
          : null,
        unemployment_rate: unemploymentData
          ? parseFloat(unemploymentData['Unemployment Rate']) || null
          : null,
      };

      return stateData;
    });

    console.log(`Successfully processed ${statesData.length} states`);
    return statesData;
  } catch (error) {
    console.error('Error fetching states data:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Response:', error.response?.data);
    }
    throw error;
  }
};

// Pro testovací účely můžeme přidat mock data
export const getMockStatesData = (): StateDataInterface[] => {
  return [
    {
      name: 'California',
      abbreviation: 'CA',
      capital: 'Sacramento',
      population: 39538223,
      political_status: PoliticalStatus.SOLID_DEM,
      household_income: 75235,
      unemployment_rate: 4.2,
    },
    {
      name: 'Texas',
      abbreviation: 'TX',
      capital: 'Austin',
      population: 29145505,
      political_status: PoliticalStatus.SOLID_REP,
      household_income: 64034,
      unemployment_rate: 3.7,
    },
    // Další státy...
  ];
};
