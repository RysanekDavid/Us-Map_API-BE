// src/states/services/state-detail.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { StateDetail, Section } from '../entities/state-detail.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StateDetailService {
  private readonly detailPath = path.join(
    __dirname,
    '../../../data/statesDetail.json',
  );

  async getStateDetail(stateName: string): Promise<StateDetail | null> {
    try {
      const data = await this.readDetailFile();
      return data.states[stateName] || null;
    } catch (error) {
      console.error('Failed to get state detail:', error);
      return null;
    }
  }

  async updateStateSections(
    stateName: string,
    sections: Section[],
  ): Promise<boolean> {
    try {
      const data = await this.readDetailFile();

      data.states[stateName] = {
        stateName,
        sections,
        lastUpdated: new Date().toISOString(),
      };

      await this.writeDetailFile(data);
      return true;
    } catch (error) {
      console.error('Failed to update state sections:', error);
      return false;
    }
  }

  private async readDetailFile() {
    const exists = fs.existsSync(this.detailPath);
    if (!exists) {
      await this.initializeDetailFile();
    }
    const content = await fs.promises.readFile(this.detailPath, 'utf8');
    return JSON.parse(content);
  }

  private async writeDetailFile(data: any) {
    await fs.promises.writeFile(
      this.detailPath,
      JSON.stringify(data, null, 2),
      'utf8',
    );
  }

  private async initializeDetailFile() {
    const defaultSection = (stateName: string) => ({
      id: '1',
      title: 'Overview',
      content: `<h1>${stateName} Overview</h1><p>Add content here...</p>`,
      order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const initialData = {
      lastUpdated: new Date().toISOString(),
      states: {},
    };

    // Načíst states.json pro získání seznamu států
    const statesPath = path.join(__dirname, '../../../data/states.json');
    const statesData = JSON.parse(fs.readFileSync(statesPath, 'utf8'));

    // Vytvořit defaultní sekci pro každý stát
    statesData.states.forEach((state) => {
      initialData.states[state.name] = {
        stateName: state.name,
        sections: [defaultSection(state.name)],
        lastUpdated: new Date().toISOString(),
      };
    });

    await this.writeDetailFile(initialData);
  }
}
