// src/states/interfaces/gdp.interface.ts
export interface WikiGDPData {
  rank: number;
  gdp: number;
  gdpPerCapita: number;
}

export interface GDPStats {
  total: number;
  average: number;
  highest: {
    state: string;
    gdp: number;
  };
  lowest: {
    state: string;
    gdp: number;
  };
}
