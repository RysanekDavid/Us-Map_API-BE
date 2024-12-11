// src/states/entities/state.entity.ts

export enum PoliticalStatus {
  SOLID_DEM = 'solid-dem',
  LEAN_DEM = 'lean-dem',
  SWING = 'swing',
  LEAN_REP = 'lean-rep',
  SOLID_REP = 'solid-rep',
}

export enum GovernorParty {
  DEMOCRAT = 'democrat',
  REPUBLICAN = 'republican',
}

export interface EconomicData {
  last_updated: string | null;
  major_industries: string[];
}

export interface State {
  id: number;
  name: string;
  capital: string;
  abbreviation: string;
  political_status: PoliticalStatus;
  population?: number;
  area?: number;
  gdp?: number;
  gdp_per_capita?: number;
  gdp_rank?: number;
  economic_data: EconomicData;
  governor_name?: string;
  governor_party?: GovernorParty;
  electoral_votes?: number;
}

export interface StateResponse {
  lastUpdated: string;
  states: State[];
}
