// src/database/interfaces/state-data.interface.ts
import { PoliticalStatus } from '../../states/entities/state.entity';

export interface StateDataInterface {
  name: string;
  abbreviation: string;
  capital: string;
  population: number;
  political_status: PoliticalStatus;
  household_income?: number | null;
  unemployment_rate?: number | null;
}
