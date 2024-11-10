// src/states/entities/state.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { StateSection } from './state-section.entity';

export enum PoliticalStatus {
  SOLID_DEM = 'solid-dem',
  LEAN_DEM = 'lean-dem',
  SWING = 'swing',
  LEAN_REP = 'lean-rep',
  SOLID_REP = 'solid-rep',
}

@Entity('states')
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capital: string;

  @Column('bigint', { nullable: true })
  population: number;

  @Column()
  abbreviation: string;

  @Column({
    type: 'enum',
    enum: PoliticalStatus,
    enumName: 'political_status_enum', // Přidáno pro lepší správu enumu
  })
  political_status: PoliticalStatus;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  household_income: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  unemployment_rate: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  median_home_value: number;

  @Column('decimal', { precision: 7, scale: 2, nullable: true })
  median_rent: number;

  @Column('bigint', { nullable: true })
  higher_education_total: number;

  @Column('jsonb', { nullable: true })
  education_breakdown: {
    bachelors: number;
    masters: number;
    professional: number;
    doctorate: number;
  };

  @Column('jsonb', { nullable: true })
  census_metadata: {
    last_updated: Date;
    state_fips: string;
  };

  @OneToMany(() => StateSection, (section) => section.state)
  sections: StateSection[];
}
