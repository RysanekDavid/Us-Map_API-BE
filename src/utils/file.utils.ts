import * as fs from 'fs';
import * as path from 'path';

export async function ensureDataFilesExist() {
  try {
    // Cesta k data složce (relativní k src/utils)
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const statesDetailFile = path.join(dataDir, 'statesDetail.json');

    // Ujisti se, že složka existuje
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Pokud statesDetail.json neexistuje, vytvoř ho s výchozí strukturou
    if (!fs.existsSync(statesDetailFile)) {
      const defaultContent = {
        lastUpdated: new Date().toISOString(),
        states: {},
      };
      fs.writeFileSync(
        statesDetailFile,
        JSON.stringify(defaultContent, null, 2),
      );
    }

    console.log('Data files checked and initialized successfully');
  } catch (error) {
    console.error('Error ensuring data files exist:', error);
    throw error;
  }
}
