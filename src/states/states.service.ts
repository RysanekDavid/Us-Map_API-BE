// src/states/states.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from './entities/state.entity';
import { StateSection } from './entities/state-section.entity';
import { CreateSectionDto } from './dto/create-section.dto';

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(StateSection)
    private readonly stateSectionRepository: Repository<StateSection>,
  ) {}

  async findAll(): Promise<State[]> {
    return this.stateRepository.find({
      relations: ['sections'],
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<State> {
    const state = await this.stateRepository.findOne({
      where: { id },
      relations: ['sections'],
    });

    if (!state) {
      throw new NotFoundException(`State with ID ${id} not found`);
    }

    return state;
  }

  async update(id: number, updateStateData: Partial<State>): Promise<State> {
    const state = await this.findOne(id);

    // Merge the updateStateData with existing state
    const mergedState = this.stateRepository.merge(state, updateStateData);

    // Save the updated state
    const savedState = await this.stateRepository.save(mergedState);

    // Return the updated state with relations
    return this.findOne(id);
  }

  // Debugging method
  async checkState(id: number): Promise<any> {
    const state = await this.stateRepository.findOne({
      where: { id },
      relations: ['sections'],
    });

    return {
      exists: !!state,
      stateData: state,
      id: id,
      typeofId: typeof id,
    };
  }
}
