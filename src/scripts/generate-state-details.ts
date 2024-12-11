//this script generates state details and was executed manually once
// src/scripts/generate-state-details.ts
import * as fs from 'fs';
import * as path from 'path';

// Definice sekcí pro každý stát
const generateDefaultSections = (stateName: string) => [
  {
    id: '1',
    title: 'History',
    content: `<h1>History of ${stateName}</h1>
      <p>The history of ${stateName} is rich and diverse, spanning centuries of development...</p>
      <h2>Early History</h2>
      <p>Before European settlement...</p>
      <h2>Statehood</h2>
      <p>The path to statehood...</p>
      <h2>Modern Era</h2>
      <p>In recent decades...</p>`,
  },
  {
    id: '2',
    title: 'Economy',
    content: `<h1>Economy of ${stateName}</h1>
      <p>${stateName}'s economy is characterized by...</p>
      <h2>Major Industries</h2>
      <p>Key economic sectors include...</p>
      <h2>Economic Indicators</h2>
      <p>Important metrics and trends...</p>
      <h2>Future Outlook</h2>
      <p>Economic projections and developments...</p>`,
  },
  {
    id: '3',
    title: 'Culture',
    content: `<h1>Culture of ${stateName}</h1>
      <p>${stateName} has a unique cultural identity...</p>
      <h2>Arts and Entertainment</h2>
      <p>The state's cultural scene...</p>
      <h2>Traditions</h2>
      <p>Local customs and celebrations...</p>
      <h2>Famous Residents</h2>
      <p>Notable people from ${stateName}...</p>`,
  },
  {
    id: '4',
    title: 'Geography',
    content: `<h1>Geography of ${stateName}</h1>
      <p>The geographical features of ${stateName}...</p>
      <h2>Physical Geography</h2>
      <p>The landscape is characterized by...</p>
      <h2>Climate</h2>
      <p>The state experiences...</p>
      <h2>Natural Resources</h2>
      <p>Important natural resources include...</p>`,
  },
];

async function generateStateDetails() {
  try {
    // Načtení seznamu států ze states.json
    const statesPath = path.join(__dirname, '../../data/states.json');
    const statesData = JSON.parse(fs.readFileSync(statesPath, 'utf8'));

    // Vytvoření detailů pro každý stát
    const stateDetails = {
      lastUpdated: new Date().toISOString(),
      states: {} as Record<
        string,
        { sections: ReturnType<typeof generateDefaultSections> }
      >,
    };

    statesData.states.forEach((state) => {
      stateDetails.states[state.name] = {
        sections: generateDefaultSections(state.name),
      };
    });

    // Uložení do souboru
    const detailsPath = path.join(__dirname, '../../data/statesDetail.json');
    fs.writeFileSync(detailsPath, JSON.stringify(stateDetails, null, 2));

    console.log('State details generated successfully!');
  } catch (error) {
    console.error('Failed to generate state details:', error);
  }
}

generateStateDetails();
