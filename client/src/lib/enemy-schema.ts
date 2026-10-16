export type Ruleset = "2014" | "2024";
export type Provenance = "SRD" | "Original" | "Criado por você";

export type AbilityKey = "for" | "des" | "con" | "int" | "sab" | "car";
export type Abilities = Record<AbilityKey, number>;

export type ActionBlock = {
  name: string;
  description: string;
  attackBonus?: number;
  saveAbility?: AbilityKey;
  saveDc?: number;
  damage?: string;
};

export type Enemy = {
  id: string;
  name: string;
  concept: string;
  ruleset: Ruleset;
  provenance: Provenance;
  size: string;
  type: string;
  alignment: string;
  armorClass: number;
  hitPoints: number;
  hitDice: string;
  speed: string;
  abilities: Abilities;
  savingThrows: string;
  skills: string;
  resistances: string;
  immunities: string;
  senses: string;
  languages: string;
  challenge: string;
  proficiencyBonus: number;
  traits: ActionBlock[];
  actions: ActionBlock[];
  reactions: ActionBlock[];
  legendaryActions: ActionBlock[];
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export const abilityLabels: Record<AbilityKey, string> = {
  for: "Força",
  des: "Destreza",
  con: "Constituição",
  int: "Inteligência",
  sab: "Sabedoria",
  car: "Carisma",
};

export const abilityShortLabels: Record<AbilityKey, string> = {
  for: "FOR",
  des: "DES",
  con: "CON",
  int: "INT",
  sab: "SAB",
  car: "CAR",
};

export const abilityKeys: AbilityKey[] = ["for", "des", "con", "int", "sab", "car"];
export const sizes = ["Miúdo", "Pequeno", "Médio", "Grande", "Enorme", "Colossal"];
export const creatureTypes = ["Aberração", "Animal", "Constructo", "Dragão", "Elemental", "Fada", "Gigante", "Humanoide", "Monstruosidade", "Morto-vivo"];
export const challenges = ["0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20+"];

export function calculateModifier(score: number) {
  return Math.floor((Number(score) - 10) / 2);
}

export function formatModifier(value: number) {
  return value >= 0 ? `+${value}` : `${value}`;
}

export function suggestedProficiency(challenge: string) {
  const value = challenge === "1/8" || challenge === "1/4" || challenge === "1/2" ? 0 : Number(challenge) || 0;
  if (value <= 4) return 2;
  if (value <= 8) return 3;
  if (value <= 12) return 4;
  if (value <= 16) return 5;
  if (value <= 20) return 6;
  return 7;
}

export function suggestedSaveDc(enemy: Enemy, ability: AbilityKey) {
  return 8 + enemy.proficiencyBonus + calculateModifier(enemy.abilities[ability]);
}

export function suggestedAttackBonus(enemy: Enemy, ability: AbilityKey = "for") {
  return enemy.proficiencyBonus + calculateModifier(enemy.abilities[ability]);
}

export function createId() {
  return `enemy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyAction(): ActionBlock {
  return { name: "Nova característica", description: "Descreva o efeito, alcance e condições." };
}

export function defaultEnemy(): Enemy {
  const now = new Date().toISOString();
  return {
    id: createId(),
    name: "",
    concept: "",
    ruleset: "2014",
    provenance: "Criado por você",
    size: "Médio",
    type: "Humanoide",
    alignment: "Neutro",
    armorClass: 12,
    hitPoints: 10,
    hitDice: "2d8",
    speed: "9 m",
    abilities: { for: 10, des: 12, con: 10, int: 10, sab: 10, car: 10 },
    savingThrows: "",
    skills: "",
    resistances: "",
    immunities: "",
    senses: "Percepção passiva 10",
    languages: "Comum",
    challenge: "1/4",
    proficiencyBonus: 2,
    traits: [],
    actions: [emptyAction()],
    reactions: [],
    legendaryActions: [],
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function starterEnemies(): Enemy[] {
  const now = new Date().toISOString();
  return [
    {
      ...defaultEnemy(),
      id: "starter-iron-moth",
      name: "Mariposa de Ferro",
      concept: "Predadora mecânica que fareja magia recente.",
      ruleset: "2024",
      provenance: "Original",
      size: "Pequeno",
      type: "Constructo",
      alignment: "Imparcial",
      armorClass: 15,
      hitPoints: 22,
      hitDice: "5d6 + 5",
      speed: "6 m, voo 12 m",
      abilities: { for: 6, des: 18, con: 12, int: 3, sab: 14, car: 5 },
      savingThrows: "DES +6",
      skills: "Percepção +4, Furtividade +6",
      resistances: "Perfurante de ataques não mágicos",
      senses: "Visão no escuro 18 m, Percepção passiva 14",
      languages: "—",
      challenge: "1",
      proficiencyBonus: 2,
      traits: [{ name: "Farol de éter", description: "A mariposa percebe qualquer conjuração feita a até 18 metros desde o fim do turno anterior." }],
      actions: [{ name: "Ferrão magnético", description: "Ataque corpo a corpo: +6 para atingir, alcance 1,5 m. Dano: 7 (1d6 + 4) perfurante mais 3 (1d6) elétrico.", attackBonus: 6, damage: "1d6 + 4 perfurante + 1d6 elétrico" }],
      notes: "Use o voo para pressionar conjuradores e criar movimento vertical.",
      createdAt: now,
      updatedAt: now,
    },
    {
      ...defaultEnemy(),
      id: "starter-mire-seer",
      name: "Oráculo do Brejo",
      concept: "Vidente anfíbio que cobra memórias em troca de passagem.",
      ruleset: "2014",
      provenance: "Original",
      size: "Médio",
      type: "Humanoide",
      alignment: "Neutro e mau",
      armorClass: 13,
      hitPoints: 45,
      hitDice: "6d8 + 18",
      speed: "9 m, natação 9 m",
      abilities: { for: 10, des: 14, con: 16, int: 12, sab: 18, car: 13 },
      savingThrows: "SAB +6, CAR +4",
      skills: "Arcanismo +3, Intuição +6, Percepção +6",
      resistances: "Veneno",
      senses: "Visão no escuro 18 m, Percepção passiva 16",
      languages: "Comum, Silvestre",
      challenge: "4",
      proficiencyBonus: 2,
      traits: [{ name: "Presságio viscoso", description: "Uma vez por rodada, quando uma criatura a até 9 m falha em um teste de resistência, o oráculo pode fazê-la deslizar 3 m sem provocar ataques de oportunidade." }],
      actions: [
        { name: "Cajado de junco", description: "Ataque corpo a corpo: +4 para atingir, alcance 1,5 m. Dano: 6 (1d6 + 3) contundente mais 4 (1d8) psíquico.", attackBonus: 4, damage: "1d6 + 3 contundente + 1d8 psíquico" },
        { name: "Olhar afogado", description: "Uma criatura a até 18 m faz um teste de resistência de Sabedoria CD 14. Em uma falha, fica amedrontada até o fim do próximo turno do oráculo.", saveAbility: "sab", saveDc: 14 },
      ],
      notes: "O oráculo funciona melhor como controlador e negociador, não como saco de PV.",
      createdAt: now,
      updatedAt: now,
    },
    {
      ...defaultEnemy(),
      id: "starter-cinder-hound",
      name: "Cão de Brasa",
      concept: "Caçador elemental que marca presas com cinzas vivas.",
      ruleset: "2024",
      provenance: "SRD",
      size: "Médio",
      type: "Elemental",
      alignment: "Caótico e neutro",
      armorClass: 14,
      hitPoints: 38,
      hitDice: "5d8 + 15",
      speed: "12 m",
      abilities: { for: 16, des: 14, con: 16, int: 5, sab: 12, car: 7 },
      savingThrows: "CON +5",
      skills: "Percepção +3, Sobrevivência +3",
      resistances: "Fogo",
      immunities: "—",
      senses: "Percepção passiva 13",
      languages: "—",
      challenge: "2",
      proficiencyBonus: 2,
      traits: [{ name: "Faro de fumaça", description: "O cão tem vantagem em testes para rastrear uma criatura que tenha sofrido dano de fogo nas últimas 24 horas." }],
      actions: [{ name: "Mordida incandescente", description: "Ataque corpo a corpo: +5 para atingir, alcance 1,5 m. Dano: 8 (1d10 + 3) perfurante mais 3 (1d6) fogo.", attackBonus: 5, damage: "1d10 + 3 perfurante + 1d6 fogo" }],
      notes: "Entrada de demonstração com estrutura compatível com SRD; revise o texto para sua campanha.",
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function validateEnemy(enemy: Enemy): string[] {
  const errors: string[] = [];
  if (!enemy.name.trim()) errors.push("Dê um nome ao inimigo.");
  if (!enemy.concept.trim()) errors.push("Adicione um conceito curto para orientar a cena.");
  if (!enemy.challenge) errors.push("Escolha um nível de desafio.");
  if (!Number.isFinite(enemy.armorClass) || enemy.armorClass < 0) errors.push("A CA precisa ser um número válido.");
  if (!Number.isFinite(enemy.hitPoints) || enemy.hitPoints < 1) errors.push("Os pontos de vida precisam ser maiores que zero.");
  if (!enemy.actions.length || enemy.actions.some(action => !action.name.trim() || !action.description.trim())) errors.push("Preencha pelo menos uma ação com nome e descrição.");
  return errors;
}

export type EncounterDifficulty = "low" | "moderate" | "high" | "easy" | "medium" | "hard" | "deadly";

const xpByChallenge: Record<string, number> = {
  "0": 10, "1/8": 25, "1/4": 50, "1/2": 100, "1": 200, "2": 450, "3": 700, "4": 1100,
  "5": 1800, "6": 2300, "7": 2900, "8": 3900, "9": 5000, "10": 5900, "11": 7200,
  "12": 8400, "13": 10000, "14": 11500, "15": 13000, "16": 15000, "17": 18000,
  "18": 20000, "19": 22000, "20": 25000, "21": 33000, "22": 41000, "23": 50000,
  "24": 62000, "25": 75000, "26": 90000, "27": 105000, "28": 120000, "29": 135000,
  "30": 155000,
};

const thresholds2014: Record<number, [number, number, number, number]> = {
  1: [25, 50, 75, 100], 2: [50, 100, 150, 200], 3: [75, 150, 225, 400], 4: [125, 250, 375, 500],
  5: [250, 500, 750, 1100], 6: [300, 600, 900, 1400], 7: [350, 750, 1100, 1700], 8: [450, 900, 1400, 2100],
  9: [550, 1100, 1600, 2400], 10: [600, 1200, 1900, 2800], 11: [800, 1600, 2400, 3600], 12: [1000, 2000, 3000, 4500],
  13: [1100, 2200, 3400, 5100], 14: [1250, 2500, 3800, 5700], 15: [1400, 2800, 4300, 6400], 16: [1600, 3200, 4800, 7200],
  17: [2000, 3900, 5900, 8800], 18: [2100, 4200, 6300, 9500], 19: [2400, 4900, 7300, 10900], 20: [2800, 5700, 8500, 12700],
};

const budgets2024: Record<number, [number, number, number]> = {
  1: [50, 75, 100], 2: [100, 150, 200], 3: [150, 225, 400], 4: [250, 375, 500],
  5: [500, 750, 1100], 6: [600, 1000, 1400], 7: [750, 1300, 1700], 8: [1000, 1700, 2100],
  9: [1300, 2000, 2600], 10: [1600, 2300, 3100], 11: [1900, 2900, 4100], 12: [2200, 3700, 4700],
  13: [2600, 4200, 5400], 14: [2900, 4900, 6200], 15: [3300, 5400, 7800], 16: [3800, 6100, 9800],
  17: [4500, 7200, 11700], 18: [5000, 8700, 14200], 19: [5500, 10700, 17200], 20: [6400, 13200, 22000],
};

export function xpForChallenge(challenge: string) {
  return xpByChallenge[challenge] ?? xpByChallenge[challenge.replace("+", "")] ?? 0;
}

function encounterMultiplier(monsterCount: number, partyCount: number) {
  const base = monsterCount <= 1 ? 1 : monsterCount === 2 ? 1.5 : monsterCount <= 6 ? 2 : monsterCount <= 10 ? 2.5 : monsterCount <= 14 ? 3 : 4;
  if (partyCount < 3) return base === 4 ? 5 : base === 3 ? 4 : base === 2.5 ? 3 : base + 0.5;
  if (partyCount >= 6) return base === 1 ? 0.5 : base === 1.5 ? 1 : base === 2 ? 1.5 : base === 2.5 ? 2 : base - 0.5;
  return base;
}

export function assessEncounter(enemy: Enemy, partyLevel: number, partyCount: number, monsterCount: number) {
  const safeLevel = Math.min(20, Math.max(1, Math.round(partyLevel)));
  const safeParty = Math.min(12, Math.max(1, Math.round(partyCount)));
  const safeMonsters = Math.min(100, Math.max(1, Math.round(monsterCount)));
  const xp = xpForChallenge(enemy.challenge) * safeMonsters;
  if (enemy.ruleset === "2024") {
    const [low, moderate, high] = budgets2024[safeLevel];
    const budget = { low: low * safeParty, moderate: moderate * safeParty, high: high * safeParty };
    const difficulty = xp <= budget.low ? "low" : xp <= budget.moderate ? "moderate" : xp <= budget.high ? "high" : "over";
    const target = difficulty === "low" ? budget.low : difficulty === "moderate" ? budget.moderate : budget.high;
    return { xp, adjustedXp: xp, difficulty, label: difficulty === "low" ? "Baixa" : difficulty === "moderate" ? "Moderada" : difficulty === "high" ? "Alta" : "Acima do orçamento", budget, target, ratio: Math.round((xp / target) * 100), note: "Em 2024, o orçamento é gasto diretamente: não há multiplicador por quantidade de monstros." };
  }
  const [easy, medium, hard, deadly] = thresholds2014[safeLevel];
  const partyThresholds = { easy: easy * safeParty, medium: medium * safeParty, hard: hard * safeParty, deadly: deadly * safeParty };
  const adjustedXp = Math.round(xp * encounterMultiplier(safeMonsters, safeParty));
  const difficulty = adjustedXp < partyThresholds.easy ? "below" : adjustedXp < partyThresholds.medium ? "easy" : adjustedXp < partyThresholds.hard ? "medium" : adjustedXp < partyThresholds.deadly ? "hard" : "deadly";
  const target = difficulty === "below" ? partyThresholds.easy : difficulty === "easy" ? partyThresholds.medium : difficulty === "medium" ? partyThresholds.hard : partyThresholds.deadly;
  return { xp, adjustedXp, difficulty, label: difficulty === "below" ? "Abaixo do fácil" : difficulty === "easy" ? "Fácil" : difficulty === "medium" ? "Médio" : difficulty === "hard" ? "Difícil" : "Mortal", budget: partyThresholds, target, ratio: Math.round((adjustedXp / target) * 100), note: `Em 2014, a quantidade de monstros aplica um multiplicador de ${encounterMultiplier(safeMonsters, safeParty)}× ao XP ajustado.` };
}

const STORAGE_KEY = "bestiario-enemies-v0";
export function loadEnemies() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return starterEnemies();
    const parsed = JSON.parse(raw) as Enemy[];
    return Array.isArray(parsed) && parsed.length ? parsed : starterEnemies();
  } catch {
    return starterEnemies();
  }
}

export function saveEnemies(enemies: Enemy[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(enemies));
}
