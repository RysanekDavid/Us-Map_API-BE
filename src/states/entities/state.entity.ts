// src/states/entities/state.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { StateSection } from './state-section.entity';

export enum PoliticalStatus {
  SOLID_DEM = 'solid-dem',
  LEAN_DEM = 'lean-dem',
  SWING = 'swing',
  LEAN_REP = 'lean-rep',
  SOLID_REP = 'solid-rep',
  INDEPENDENT = 'independent-territory',
}

@Entity('states')
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capital: string;

  @Column()
  population: number;

  @Column()
  abbreviation: string;

  @Column({
    type: 'enum',
    enum: PoliticalStatus,
  })
  political_status: PoliticalStatus;

  // Přidáváme vztah OneToMany
  @OneToMany(() => StateSection, (section) => section.state)
  sections: StateSection[];
}
