// src/states/entities/state-detail.entity.ts
export interface Section {
  id: string;
  title: string;
  content: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface StateDetail {
  stateName: string;
  sections: Section[];
  lastUpdated: string;
}
