// src/database/seeds/sections.seed.ts
export interface SectionData {
  title: string;
  content: string;
  order: number;
}

export const stateSections: SectionData[] = [
  {
    title: 'Historie',
    content: `Historie státu zahrnuje klíčové momenty v jeho vývoji, včetně původního osídlení, 
      vstupu do Unie, významných historických událostí a milníků, které utvářely jeho současnou podobu.`,
    order: 1,
  },
  {
    title: 'Geografie',
    content: `Geografické informace zahrnují polohu státu, jeho rozlohu, přírodní útvary, 
      klima, vodstvo a další fyzicko-geografické charakteristiky území.`,
    order: 2,
  },
  {
    title: 'Ekonomika',
    content: `Ekonomický přehled státu obsahuje informace o hlavních průmyslových odvětvích, 
      zemědělství, službách, zaměstnanosti, příjmech obyvatel a celkovém ekonomickém profilu.`,
    order: 3,
  },
  {
    title: 'Demografie',
    content: `Demografické údaje zahrnují informace o populaci, věkovém složení obyvatelstva, 
      etnických skupinách, vzdělání a dalších sociodemografických charakteristikách.`,
    order: 4,
  },
  {
    title: 'Politika',
    content: `Politický přehled obsahuje informace o současném politickém směřování státu, 
      volební historii, klíčových politických představitelích a významných politických událostech.`,
    order: 5,
  },
];
