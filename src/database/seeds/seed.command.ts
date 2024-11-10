// src/database/seeds/seed.command.ts
import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from '../../states/entities/state.entity';
import { StateSection } from '../../states/entities/state-section.entity';
import { getStatesData } from '../seeds/state.seed';
import { stateSections } from '../seeds/sections.seed';

@Injectable()
export class SeedCommand {
  constructor(
    @InjectRepository(State)
    private stateRepository: Repository<State>,
    @InjectRepository(StateSection)
    private stateSectionRepository: Repository<StateSection>,
  ) {}

  @Command({
    command: 'seed:states',
    describe: 'Seed states data',
  })
  async seedStates() {
    try {
      console.log('Starting to seed states data...');

      const statesData = await getStatesData();

      console.log(`Fetched ${statesData.length} states from API`);

      for (const stateData of statesData) {
        console.log(`Processing state: ${stateData.name}`);

        // Vytvoření nového státu
        const state = this.stateRepository.create(stateData);
        const savedState = await this.stateRepository.save(state);

        // Vytvoření sekcí pro stát
        for (const sectionData of stateSections) {
          const section = this.stateSectionRepository.create({
            ...sectionData,
            state: savedState,
          });
          await this.stateSectionRepository.save(section);
        }

        console.log(`Completed processing state: ${stateData.name}`);
      }

      console.log('Seeding completed successfully');
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error;
    }
  }
}
