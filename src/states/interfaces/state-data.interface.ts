// src/states/interfaces/state-data.interface.ts

import { PoliticalStatus } from '../entities/state.entity';

export interface StateDataInterface {
  name: string;
  abbreviation: string;
  capital: string;
  population: number;
  area: number;
  political_status: PoliticalStatus;
}

export interface StateSeedData {
  name: string;
  abbreviation: string;
  capital: string;
  population: number;
  area: number;
  political_status: PoliticalStatus;
  census_metadata: {
    state_fips: string;
    last_updated: Date;
  };
}

export interface StateDetailResponse {
  id: number;
  name: string;
  overview: {
    capital: string;
    abbreviation: string;
    political_status: string;
    last_census_update: Date | null;
  };
  demographics: {
    total_population: string;
    population_rank?: number;
    education: {
      total_higher_education: string;
      education_rate_percent: number;
      breakdown: {
        bachelors: number;
        masters: number;
        professional: number;
        doctorate: number;
      };
    };
  };
  economics: {
    household_income: {
      median: string;
      state_rank?: number;
    };
    unemployment: {
      rate: string;
      state_rank?: number;
    };
    housing: {
      median_home_value: string;
      median_rent: string;
      home_value_rank?: number;
    };
  };
  sections: {
    id: number;
    title: string;
    content: string;
    order: number;
  }[];
}
