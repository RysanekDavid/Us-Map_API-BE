import * as fs from 'fs';
import * as path from 'path';
import { State, StateResponse } from '../states/entities/state.entity';

export async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read JSON file: ${error.message}`);
  }
}

export async function writeJsonFile(filePath: string, data: any) {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(`Failed to write JSON file: ${error.message}`);
  }
}

export async function updateStateData(stateData: Partial<State>) {
  try {
    const filePath = path.join(__dirname, '../../data/states.json');
    let data: StateResponse;

    // Pokud soubor existuje, načteme ho
    if (fs.existsSync(filePath)) {
      data = await readJsonFile<StateResponse>(filePath);
    } else {
      // Pokud neexistuje, vytvoříme nový s prázdným polem států
      data = {
        lastUpdated: new Date().toISOString(),
        states: [],
      };
    }

    // Najdeme index státu
    const stateIndex = data.states.findIndex(
      (state) => state.name === stateData.name,
    );

    if (stateIndex >= 0) {
      // Aktualizujeme existující stát, ale zachováme původní data
      data.states[stateIndex] = {
        ...data.states[stateIndex], // zachováme původní data
        ...stateData, // přidáme nová data
      };
    } else {
      // Přidáme nový stát
      data.states.push(stateData as State);
    }

    // Aktualizujeme čas poslední změny
    data.lastUpdated = new Date().toISOString();
    await writeJsonFile(filePath, data);
  } catch (error) {
    throw new Error(`Failed to update state data: ${error.message}`);
  }
}
