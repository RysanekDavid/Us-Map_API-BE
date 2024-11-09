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
    private statesRepository: Repository<State>,
    @InjectRepository(StateSection)
    private sectionsRepository: Repository<StateSection>,
  ) {}

  // Najde všechny státy, volitelně filtrované podle political_status
  async findAll(politicalStatus?: string): Promise<State[]> {
    const query = this.statesRepository
      .createQueryBuilder('state')
      .leftJoinAndSelect('state.sections', 'sections')
      .orderBy('state.name', 'ASC');

    if (politicalStatus) {
      query.where('state.political_status = :politicalStatus', {
        politicalStatus,
      });
    }

    return query.getMany();
  }

  // Najde jeden stát podle ID
  async findOne(id: number): Promise<State> {
    const state = await this.statesRepository.findOne({
      where: { id },
      relations: ['sections'],
    });

    if (!state) {
      throw new NotFoundException(`State with ID ${id} not found`);
    }

    return state;
  }

  // METODY PRO PRÁCI SE SEKCEMI

  // Získá všechny sekce státu
  async getSections(stateId: number): Promise<StateSection[]> {
    const state = await this.findOne(stateId);
    return this.sectionsRepository.find({
      where: { state: { id: stateId } },
      order: { order: 'ASC' },
    });
  }

  // Přidá novou sekci ke státu
  async addSection(
    stateId: number,
    createSectionDto: CreateSectionDto,
  ): Promise<StateSection> {
    const state = await this.findOne(stateId);

    const section = this.sectionsRepository.create({
      ...createSectionDto,
      state,
    });

    return this.sectionsRepository.save(section);
  }

  // Aktualizuje sekci
  async updateSection(
    stateId: number,
    sectionId: number,
    updateSectionDto: CreateSectionDto,
  ): Promise<StateSection> {
    const section = await this.sectionsRepository.findOne({
      where: { id: sectionId, state: { id: stateId } },
    });

    if (!section) {
      throw new NotFoundException(
        `Section ${sectionId} not found in state ${stateId}`,
      );
    }

    Object.assign(section, updateSectionDto);
    return this.sectionsRepository.save(section);
  }

  // Smaže sekci
  async deleteSection(stateId: number, sectionId: number): Promise<void> {
    const section = await this.sectionsRepository.findOne({
      where: { id: sectionId, state: { id: stateId } },
    });

    if (!section) {
      throw new NotFoundException(
        `Section ${sectionId} not found in state ${stateId}`,
      );
    }

    await this.sectionsRepository.remove(section);
  }
}
