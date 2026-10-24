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

export type ActionTemplate = ActionBlock & { category: "passiva" | "ação" | "reação" | "lendária"; summary: string };

export const actionTemplates: ActionTemplate[] = [
  { name: "Ataque multi-ação", summary: "Pressiona um alvo com mais de um golpe.", category: "ação", description: "A criatura realiza dois ataques, usando a mesma ação.", attackBonus: 5, damage: "1d8 + 3 cortante" },
  { name: "Ataque à distância", summary: "Opção segura para atacar de longe.", category: "ação", description: "Ataque à distância: alcance 18/72 m. A criatura faz um ataque contra um alvo que possa ver.", attackBonus: 5, damage: "1d8 + 3 perfurante" },
  { name: "Explosão elemental", summary: "Dano em área com teste de resistência.", category: "ação", description: "Cada criatura em uma área de 3 m faz um teste de resistência de Destreza, sofrendo metade do dano em um sucesso.", saveAbility: "des", saveDc: 14, damage: "3d6 fogo" },
  { name: "Empurrão brutal", summary: "Dano e reposicionamento do alvo.", category: "ação", description: "Em um acerto, o alvo sofre o dano e deve ser empurrado 3 m se falhar em um teste de resistência de Força.", attackBonus: 5, damage: "1d10 + 3 contundente" },
  { name: "Recarga — sopro", summary: "Ataque forte que volta com recarga.", category: "ação", description: "A criatura expele energia em um cone de 4,5 m. Cada criatura na área faz um teste de resistência.", saveAbility: "des", saveDc: 15, damage: "6d6 ácido" },
  { name: "Aparar", summary: "Reação defensiva para reduzir dano.", category: "reação", description: "A criatura adiciona 2 à sua CA contra um ataque corpo a corpo que a atingiria. Para isso, deve ver o atacante." },
  { name: "Passo sombrio", summary: "Movimento rápido sem provocar ataques.", category: "passiva", description: "Como ação bônus, a criatura se teleporta até 9 m para um espaço desocupado que possa ver." },
  { name: "Resistência lendária", summary: "Evita uma falha decisiva.", category: "lendária", description: "Se a criatura falhar em um teste de resistência, ela pode escolher ser bem-sucedida em vez disso." },
  { name: "Agarrar", summary: "Prende um alvo próximo.", category: "ação", description: "Em um acerto, o alvo fica agarrado. O alvo pode repetir o teste no fim de cada turno.", attackBonus: 5, damage: "1d6 + 3 contundente" },
  { name: "Rajada de medo", summary: "Assusta vários inimigos.", category: "ação", description: "Cada criatura em um cone de 4,5 m faz um teste de resistência de Sabedoria ou fica amedrontada até o fim do próximo turno.", saveAbility: "sab", saveDc: 14 },
  { name: "Manto de sombras", summary: "Fica difícil de atingir.", category: "passiva", description: "Enquanto estiver em luz fraca ou escuridão, ataques contra a criatura têm desvantagem até o início do próximo turno dela." },
  { name: "Vontade inabalável", summary: "Resiste a medo e encantamento.", category: "passiva", description: "A criatura tem vantagem em testes de resistência contra as condições amedrontado e enfeitiçado." },
  { name: "Contra-ataque", summary: "Responde quando é atingida.", category: "reação", description: "Quando uma criatura erra um ataque corpo a corpo contra ela, a criatura pode fazer um ataque contra o atacante.", attackBonus: 5, damage: "1d8 + 3 cortante" },
  { name: "Comando do mestre", summary: "Concede uma ação a um aliado.", category: "lendária", description: "Uma criatura aliada que possa ouvir pode se mover até metade do deslocamento e fazer um ataque usando a reação." },
  { name: "Mordida", summary: "Ataque corpo a corpo simples e brutal.", category: "ação", description: "Ataque corpo a corpo: alcance 1,5 m. A criatura faz um ataque de mordida contra um alvo.", attackBonus: 5, damage: "1d8 + 3 perfurante" },
  { name: "Garras", summary: "Dois golpes rápidos com as garras.", category: "ação", description: "A criatura faz dois ataques de garras contra um alvo ao alcance.", attackBonus: 5, damage: "1d6 + 3 cortante" },
  { name: "Pancada esmagadora", summary: "Golpe pesado que pode derrubar.", category: "ação", description: "Em um acerto, o alvo sofre dano e deve passar em um teste de resistência de Força ou ficará caído.", attackBonus: 6, damage: "2d8 + 4 contundente" },
  { name: "Picada venenosa", summary: "Ataque com veneno persistente.", category: "ação", description: "Em um acerto, o alvo deve passar em um teste de resistência de Constituição ou ficará envenenado até o fim do próximo turno.", attackBonus: 5, damage: "1d6 + 3 perfurante" },
  { name: "Chicote de cauda", summary: "Ataque de alcance que empurra.", category: "ação", description: "Ataque corpo a corpo: alcance 4,5 m. Em um acerto, o alvo pode ser empurrado 3 m.", attackBonus: 6, damage: "2d6 + 4 contundente" },
  { name: "Arco longo", summary: "Ataque à distância de precisão.", category: "ação", description: "Ataque à distância: alcance 45/180 m. A criatura dispara uma flecha contra um alvo que possa ver.", attackBonus: 6, damage: "1d8 + 4 perfurante" },
  { name: "Rajada de espinhos", summary: "Vários projéteis em uma área.", category: "ação", description: "Cada criatura em uma linha de 9 m faz um teste de resistência de Destreza, sofrendo metade do dano em um sucesso.", saveAbility: "des", saveDc: 14, damage: "4d6 perfurante" },
  { name: "Esfera flamejante", summary: "Explosão de fogo em área.", category: "ação", description: "Cada criatura em uma esfera de 3 m faz um teste de resistência de Destreza, sofrendo metade do dano em um sucesso.", saveAbility: "des", saveDc: 15, damage: "5d6 fogo" },
  { name: "Raio gélido", summary: "Dano e redução de deslocamento.", category: "ação", description: "Em um acerto, o alvo sofre dano e seu deslocamento é reduzido pela metade até o fim do próximo turno.", attackBonus: 6, damage: "3d8 frio" },
  { name: "Relâmpago em linha", summary: "Energia que atravessa vários alvos.", category: "ação", description: "Cada criatura em uma linha de 18 m faz um teste de resistência de Destreza, sofrendo metade do dano em um sucesso.", saveAbility: "des", saveDc: 16, damage: "8d6 elétrico" },
  { name: "Sopro corrosivo", summary: "Cone de ácido que enfraquece armaduras.", category: "ação", description: "Cada criatura em um cone de 4,5 m faz um teste de resistência de Destreza. Em uma falha, a CA do alvo diminui em 1 até o próximo descanso.", saveAbility: "des", saveDc: 15, damage: "6d6 ácido" },
  { name: "Sopro de gelo", summary: "Cone congelante que imobiliza.", category: "ação", description: "Cada criatura em um cone de 9 m faz um teste de resistência de Constituição ou fica com deslocamento 0 até o fim do próximo turno.", saveAbility: "con", saveDc: 16, damage: "8d8 frio" },
  { name: "Uivo aterrador", summary: "Medo em área ao redor da criatura.", category: "ação", description: "Cada criatura a até 9 m que possa ouvir o uivo faz um teste de resistência de Sabedoria ou fica amedrontada por 1 minuto.", saveAbility: "sab", saveDc: 15 },
  { name: "Olhar petrificante", summary: "Ameaça que transforma lentamente o alvo.", category: "ação", description: "Uma criatura que comece o turno olhando para a criatura faz um teste de resistência de Constituição. Em uma falha, fica restrita e começa a petrificar.", saveAbility: "con", saveDc: 16 },
  { name: "Toque drenante", summary: "Dano necrótico que reduz a força do alvo.", category: "ação", description: "Em um acerto, o alvo sofre dano necrótico e deve passar em um teste de resistência de Constituição ou terá desvantagem no próximo ataque.", attackBonus: 6, damage: "3d8 necrótico" },
  { name: "Roubo de vida", summary: "Recupera PV ao ferir um inimigo.", category: "ação", description: "Em um acerto, a criatura recupera pontos de vida iguais à metade do dano causado.", attackBonus: 7, damage: "4d6 necrótico" },
  { name: "Teleporte ofensivo", summary: "Desaparece e reaparece atacando.", category: "ação", description: "A criatura se teleporta até 9 m para um espaço desocupado que possa ver e faz um ataque contra um alvo ao alcance.", attackBonus: 7, damage: "2d8 + 4 força" },
  { name: "Invocar lacaios", summary: "Traz aliados menores para o campo.", category: "ação", description: "A criatura invoca 1d4 lacaios temáticos em espaços desocupados que possa ver. Eles permanecem até serem derrotados ou até a criatura perder a concentração.", saveDc: 15 },
  { name: "Onda de choque", summary: "Empurra criaturas próximas.", category: "ação", description: "Cada criatura a até 4,5 m faz um teste de resistência de Força. Em uma falha, sofre dano e é empurrada 3 m.", saveAbility: "for", saveDc: 15, damage: "3d8 trovejante" },
  { name: "Ação astuta", summary: "Move-se sem abrir brechas.", category: "ação", description: "A criatura pode Correr, Desengajar ou Esconder-se como ação bônus.", },
  { name: "Aparição súbita", summary: "Surge de um espaço oculto.", category: "ação", description: "A criatura se torna invisível até o fim do turno ou até realizar um ataque. O primeiro ataque feito nesse turno tem vantagem.", },
  { name: "Parada defensiva", summary: "Reação que aumenta a CA.", category: "reação", description: "Quando um ataque a atingiria, a criatura adiciona 3 à CA contra esse ataque, podendo fazer o ataque errar." },
  { name: "Resistir ao efeito", summary: "Reação para repetir uma resistência.", category: "reação", description: "Quando falha em um teste de resistência, a criatura pode repetir o teste e deve usar o novo resultado." },
  { name: "Movimento instintivo", summary: "Reação para escapar de uma área.", category: "reação", description: "Quando uma criatura termina o turno a até 1,5 m, a criatura pode se mover até metade do deslocamento sem provocar ataques de oportunidade." },
  { name: "Interpor-se", summary: "Protege um aliado próximo.", category: "reação", description: "Quando um aliado a até 1,5 m for atingido, a criatura pode trocar de lugar com ele e se tornar o alvo do ataque." },
  { name: "Ataque lendário: golpe", summary: "Um ataque rápido entre turnos.", category: "lendária", description: "A criatura faz um ataque corpo a corpo contra um alvo ao alcance.", attackBonus: 7, damage: "2d8 + 4 contundente" },
  { name: "Ataque lendário: mover", summary: "Reposiciona-se sem ser punida.", category: "lendária", description: "A criatura se move até metade do deslocamento sem provocar ataques de oportunidade." },
  { name: "Ataque lendário: conjurar", summary: "Lança uma magia menor.", category: "lendária", description: "A criatura conjura uma magia ou usa uma habilidade que tenha tempo de conjuração de 1 ação." },
  { name: "Ataque lendário: cauda", summary: "Golpe que derruba o alvo.", category: "lendária", description: "A criatura faz um ataque de cauda. Em um acerto, o alvo deve passar em um teste de Força ou cairá no chão.", attackBonus: 8, damage: "2d10 + 5 contundente" },
  { name: "Ação lendária: comando", summary: "Um aliado age imediatamente.", category: "lendária", description: "Uma criatura aliada que possa ouvir pode fazer um ataque como reação." },
  { name: "Ação lendária: recuperar", summary: "Recupera uma habilidade de recarga.", category: "lendária", description: "A criatura recupera uma habilidade que tenha sido usada e possua uma chance de recarga." },
].map(({ category, summary, ...action }) => ({ ...action, category, summary })) as ActionTemplate[];

export type BalanceWarning = { level: "info" | "warning" | "danger"; title: string; detail: string };

export function balanceWarnings(enemy: Enemy): BalanceWarning[] {
  const cr = Math.min(20, Math.max(0, Math.floor(challengeToNumber(enemy.challenge))));
  const base = statBenchmarks[cr] ?? statBenchmarks[0];
  const warnings: BalanceWarning[] = [];
  if (!enemy.name.trim()) warnings.push({ level: "info", title: "Dê um nome à criatura", detail: "Um nome ajuda a identificar esta ficha na biblioteca e no modo Combate." });
  if (enemy.hitPoints > base.hp * 1.8) warnings.push({ level: "warning", title: "PV acima da faixa sugerida", detail: `${enemy.hitPoints} PV está bem acima da referência de ${base.hp} PV para ND ${enemy.challenge}.` });
  if (enemy.hitPoints < base.hp * 0.45) warnings.push({ level: "warning", title: "PV abaixo da faixa sugerida", detail: `${enemy.hitPoints} PV pode fazer a criatura cair antes de cumprir seu papel.` });
  if (enemy.armorClass > base.ac + 4) warnings.push({ level: "warning", title: "CA muito alta para o ND", detail: `A CA ${enemy.armorClass} está acima da referência de ${base.ac}. Resistências podem elevar ainda mais a durabilidade.` });
  if (enemy.actions.length === 0) warnings.push({ level: "danger", title: "Nenhuma ação cadastrada", detail: "Adicione pelo menos uma ação para que a criatura seja utilizável no modo Combate." });
  const attackValues = enemy.actions.map(action => action.attackBonus).filter((value): value is number => typeof value === "number");
  if (attackValues.some(value => value > base.attack + 4)) warnings.push({ level: "warning", title: "Bônus de ataque elevado", detail: `Há uma ação com bônus acima da referência de +${base.attack} para este ND.` });
  const saveValues = enemy.actions.map(action => action.saveDc).filter((value): value is number => typeof value === "number");
  if (saveValues.some(value => value > base.dc + 4)) warnings.push({ level: "warning", title: "CD muito alta para o ND", detail: `Há uma ação com CD acima da referência de ${base.dc}.` });
  if (enemy.resistances && enemy.immunities) warnings.push({ level: "info", title: "Defesas especiais acumuladas", detail: "Resistências e imunidades juntas podem tornar o encontro mais difícil do que o cálculo de XP indica." });
  return warnings;
}

export type Enemy = {
  id: string;
  name: string;
  concept: string;
  image: string;
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

export const passiveTemplates = [
  { name: "Resistência a dano", description: "A criatura tem resistência a um tipo de dano escolhido pelo Mestre." },
  { name: "Visão no escuro", description: "A criatura enxerga na penumbra a até 18 metros como se fosse luz plena e na escuridão como se fosse penumbra." },
  { name: "Faro aguçado", description: "A criatura tem vantagem em testes de Sabedoria (Percepção) que dependam do olfato." },
  { name: "Aura de ameaça", description: "Uma criatura que comece o turno a até 3 metros deve ser bem-sucedida em um teste de resistência ou ficará amedrontada até o início do próximo turno da criatura." },
  { name: "Regeneração", description: "A criatura recupera uma quantidade de pontos de vida no início de cada turno. A regeneração não funciona após sofrer o tipo de dano definido pelo Mestre." },
  { name: "Evasão", description: "Se a criatura for bem-sucedida em um teste de resistência de Destreza para sofrer metade do dano, ela não sofre dano; se falhar, sofre metade." },
  { name: "Resistência mágica", description: "A criatura tem vantagem em testes de resistência contra magias e outros efeitos mágicos." },
  { name: "Camuflagem natural", description: "A criatura tem vantagem em testes de Destreza (Furtividade) feitos para se esconder no ambiente escolhido pelo Mestre." },
  { name: "Imunidade a condição", description: "A criatura não pode ser enfeitiçada, amedrontada, envenenada ou sofrer a condição escolhida pelo Mestre." },
  { name: "Sentido sísmico", description: "A criatura pode detectar vibrações através do solo a até 18 metros, desde que esteja em contato com a mesma superfície." },
  { name: "Deslocamento aracnídeo", description: "A criatura pode escalar superfícies difíceis, inclusive de cabeça para baixo, sem precisar fazer testes de habilidade." },
  { name: "Mimetismo", description: "A criatura pode imitar sons que tenha ouvido. Uma criatura que ouvir pode perceber o truque com um teste de Sabedoria (Percepção)." },
  { name: "Absorver energia", description: "Quando sofre dano do tipo escolhido, a criatura reduz o dano e ganha vantagem no próximo ataque antes do fim do turno seguinte." },
  { name: "Anfíbio", description: "A criatura pode respirar ar e água." },
  { name: "Brutamontes", description: "Um ataque corpo a corpo que causar dano reduz os pontos de vida do alvo como se tivesse causado um dado de dano adicional." },
  { name: "Furtividade sobrenatural", description: "A criatura pode tentar se esconder mesmo quando está apenas levemente obscurecida." },
  { name: "Resistência lendária", description: "Três vezes por dia, a criatura pode escolher ser bem-sucedida em um teste de resistência que tenha falhado." },
  { name: "Armas mágicas", description: "Os ataques da criatura são mágicos para superar resistência e imunidade a ataques não mágicos." },
  { name: "Desviar projéteis", description: "A criatura pode usar sua reação para reduzir o dano de um ataque à distância e, se reduzir a zero, devolver o projétil." },
  { name: "Regeneração de sombra", description: "A criatura recupera 10 PV no início do turno se estiver em luz fraca ou escuridão e não tiver sofrido dano radiante desde o turno anterior." },
  { name: "Corpo amorfo", description: "A criatura pode se mover através de um espaço de até 2,5 cm sem se espremer." },
  { name: "Mente alienígena", description: "A criatura é imune a efeitos que leiam seus pensamentos ou determinem se está mentindo." },
  { name: "Presença avassaladora", description: "Criaturas que começam o turno a até 9 m devem passar em um teste de Sabedoria ou ficarão amedrontadas até o próximo turno." },
  { name: "Aura de proteção", description: "Aliados a até 3 m recebem +2 nos testes de resistência enquanto a criatura estiver consciente." },
  { name: "Resistência à magia", description: "A criatura tem vantagem nos testes de resistência contra magias e outros efeitos mágicos." },
] as const;

export function defaultEnemy(): Enemy {
  const now = new Date().toISOString();
  return {
    id: createId(),
    name: "",
    concept: "",
    image: "",
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

export function challengeToNumber(challenge: string) {
  if (challenge === "1/8") return 0.125;
  if (challenge === "1/4") return 0.25;
  if (challenge === "1/2") return 0.5;
  if (challenge === "20+") return 20;
  return Number(challenge) || 0;
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

export type EncounterEntry = { enemyId: string; count: number };
export type EnemyRole = "atacante" | "tanque" | "controlador" | "suporte" | "chefe";
export type AbilityRecommendation = { abilities: Abilities; primary: AbilityKey; secondary: AbilityKey; note: string };

export function suggestAbilityScores(challenge: string, role: EnemyRole = "atacante", creatureType = "") : AbilityRecommendation {
  const cr = Math.min(20, Math.max(0, Math.floor(challengeToNumber(challenge))));
  const growth = Math.floor(cr / 4);
  const matrix: Record<EnemyRole, [number, number, number, number, number, number, AbilityKey, AbilityKey, string]> = {
    atacante: [16, 14, 14, 8, 12, 10, "for", "des", "Prioriza o atributo usado para atacar e mantém DES suficiente para iniciativa e defesa."],
    tanque: [16, 10, 18, 8, 12, 10, "for", "con", "Prioriza FOR para ameaçar e CON para sustentar a criatura no campo."],
    controlador: [8, 14, 14, 16, 14, 10, "int", "sab", "Prioriza o atributo da CD e mantém SAB para percepção e resistência mental."],
    suporte: [8, 14, 14, 14, 16, 12, "sab", "car", "Prioriza SAB para percepção, suporte e CDs; CAR ajuda na presença da criatura."],
    chefe: [18, 14, 16, 14, 14, 14, "for", "des", "Distribui valores altos para funcionar como ameaça central sem depender de um único número."],
  };
  const [forca, destreza, constituicao, inteligencia, sabedoria, carisma, primary, secondary, note] = matrix[role];
  const values: Abilities = { for: forca, des: destreza, con: constituicao, int: inteligencia, sab: sabedoria, car: carisma };
  values[primary] = Math.min(30, values[primary] + growth);
  values[secondary] = Math.min(30, values[secondary] + Math.floor(growth / 2));
  if (["Animal", "Monstruosidade", "Dragão"].includes(creatureType) && role !== "controlador" && role !== "suporte") values.sab = Math.max(values.sab, 12 + Math.floor(cr / 5));
  if (["Fada", "Aberração", "Elemental"].includes(creatureType) && (role === "controlador" || role === "suporte")) values.int = Math.max(values.int, 14 + Math.floor(cr / 5));
  return { abilities: values, primary, secondary, note: `${note} A recomendação considera ND ${challenge}${creatureType ? ` e tipo ${creatureType}` : ""}; ajuste livremente para a história.` };
}


export type StatSuggestions = {
  hitPoints: number;
  hitDice: string;
  armorClass: number;
  speed: string;
  attackBonus: number;
  saveDc: number;
  damagePerRound: number;
  proficiencyBonus: number;
  role: EnemyRole;
  note: string;
};

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

export function encounterMultiplier(monsterCount: number, partyCount: number) {
  const base = monsterCount <= 1 ? 1 : monsterCount === 2 ? 1.5 : monsterCount <= 6 ? 2 : monsterCount <= 10 ? 2.5 : monsterCount <= 14 ? 3 : 4;
  if (partyCount < 3) return base === 4 ? 5 : base === 3 ? 4 : base === 2.5 ? 3 : base + 0.5;
  if (partyCount >= 6) return base === 1 ? 0.5 : base === 1.5 ? 1 : base === 2 ? 1.5 : base === 2.5 ? 2 : base - 0.5;
  return base;
}

function assessEncounterXp(xp: number, ruleset: Ruleset, partyLevel: number, partyCount: number, monsterCount: number) {
  const safeLevel = Math.min(20, Math.max(1, Math.round(partyLevel)));
  const safeParty = Math.min(12, Math.max(1, Math.round(partyCount)));
  const safeMonsters = Math.min(100, Math.max(1, Math.round(monsterCount)));
  if (ruleset === "2024") {
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

export function assessEncounter(enemy: Enemy, partyLevel: number, partyCount: number, monsterCount: number) {
  const safeMonsters = Math.min(100, Math.max(1, Math.round(monsterCount)));
  return assessEncounterXp(xpForChallenge(enemy.challenge) * safeMonsters, enemy.ruleset, partyLevel, partyCount, safeMonsters);
}

export function assessEncounterComposition(enemies: Enemy[], entries: EncounterEntry[], ruleset: Ruleset, partyLevel: number, partyCount: number) {
  const lines = entries.map(entry => {
    const enemy = enemies.find(item => item.id === entry.enemyId);
    const count = Math.min(100, Math.max(1, Math.round(entry.count)));
    return enemy ? { enemyId: enemy.id, name: enemy.name, challenge: enemy.challenge, count, xp: xpForChallenge(enemy.challenge) * count } : null;
  }).filter((line): line is { enemyId: string; name: string; challenge: string; count: number; xp: number } => line !== null);
  const monsterCount = lines.reduce((total, line) => total + line.count, 0);
  const base = assessEncounterXp(lines.reduce((total, line) => total + line.xp, 0), ruleset, partyLevel, partyCount, monsterCount);
  return { ...base, lines, monsterCount };
}

const statBenchmarks: Record<number, { hp: number; ac: number; attack: number; dc: number; damage: number; die: string }> = {
  0: { hp: 8, ac: 12, attack: 3, dc: 10, damage: 3, die: "2d6" },
  1: { hp: 15, ac: 13, attack: 3, dc: 11, damage: 5, die: "3d8" },
  2: { hp: 30, ac: 13, attack: 4, dc: 12, damage: 11, die: "5d8" },
  3: { hp: 45, ac: 14, attack: 5, dc: 13, damage: 16, die: "6d8" },
  4: { hp: 65, ac: 15, attack: 6, dc: 14, damage: 22, die: "10d8" },
  5: { hp: 85, ac: 15, attack: 7, dc: 15, damage: 28, die: "10d10" },
  6: { hp: 100, ac: 16, attack: 8, dc: 15, damage: 34, die: "12d10" },
  7: { hp: 115, ac: 16, attack: 9, dc: 16, damage: 40, die: "14d10" },
  8: { hp: 130, ac: 17, attack: 10, dc: 16, damage: 46, die: "15d10" },
  9: { hp: 145, ac: 17, attack: 10, dc: 16, damage: 52, die: "17d10" },
  10: { hp: 160, ac: 18, attack: 11, dc: 17, damage: 58, die: "19d10" },
  11: { hp: 175, ac: 18, attack: 12, dc: 17, damage: 64, die: "20d10" },
  12: { hp: 190, ac: 18, attack: 13, dc: 18, damage: 70, die: "21d10" },
  13: { hp: 205, ac: 19, attack: 13, dc: 18, damage: 76, die: "22d10" },
  14: { hp: 220, ac: 19, attack: 14, dc: 18, damage: 82, die: "24d10" },
  15: { hp: 235, ac: 19, attack: 14, dc: 19, damage: 88, die: "25d10" },
  16: { hp: 250, ac: 20, attack: 15, dc: 19, damage: 94, die: "26d10" },
  17: { hp: 265, ac: 20, attack: 16, dc: 20, damage: 100, die: "27d10" },
  18: { hp: 280, ac: 20, attack: 16, dc: 20, damage: 106, die: "28d10" },
  19: { hp: 295, ac: 21, attack: 17, dc: 21, damage: 112, die: "29d10" },
  20: { hp: 310, ac: 21, attack: 17, dc: 21, damage: 118, die: "30d10" },
};

export function suggestEnemyStats(challenge: string, ruleset: Ruleset, role: EnemyRole = "atacante"): StatSuggestions {
  const cr = Math.min(20, Math.max(0, Math.floor(challengeToNumber(challenge))));
  const base = statBenchmarks[cr];
  const multipliers: Record<EnemyRole, { hp: number; ac: number; damage: number; speed: string }> = {
    atacante: { hp: 0.9, ac: 0, damage: 1.2, speed: "9 m" },
    tanque: { hp: 1.35, ac: 2, damage: 0.85, speed: "9 m" },
    controlador: { hp: 0.9, ac: 0, damage: 0.8, speed: "9 m" },
    suporte: { hp: 0.85, ac: 0, damage: 0.7, speed: "9 m" },
    chefe: { hp: 1.6, ac: 2, damage: 1.35, speed: "9 m" },
  };
  const modifier = multipliers[role];
  const rulesetAdjust = ruleset === "2024" ? 1 : 0;
  const hitPoints = Math.max(1, Math.round(base.hp * modifier.hp));
  return {
    hitPoints,
    hitDice: base.die,
    armorClass: base.ac + modifier.ac + rulesetAdjust,
    speed: modifier.speed,
    attackBonus: base.attack + rulesetAdjust,
    saveDc: base.dc + rulesetAdjust,
    damagePerRound: Math.max(1, Math.round(base.damage * modifier.damage)),
    proficiencyBonus: suggestedProficiency(challenge),
    role,
    note: "Faixas de criação para começar o design, não valores obrigatórios. Resistências, ações extras, controle e terreno podem alterar bastante o poder real.",
  };
}

export type DiceRoll = { total: number; rolls: number[]; modifier: number; formula: string };

export function rollDice(formula: string): DiceRoll {
  const normalized = formula.replace(/\s+/g, "").toLowerCase();
  const match = normalized.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!match) return { total: 0, rolls: [], modifier: 0, formula };
  const count = Math.min(100, Math.max(1, Number(match[1] || 1)));
  const sides = Math.min(1000, Math.max(2, Number(match[2])));
  const modifier = Number(match[3] || 0);
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  return { total: rolls.reduce((sum, value) => sum + value, modifier), rolls, modifier, formula };
}

export function rollDamage(damage: string): DiceRoll {
  const formulas = damage.match(/\d*d\d+(?:\s*[+-]\s*\d+)?/gi) ?? [];
  const rolls = formulas.map(rollDice);
  return { total: rolls.reduce((sum, result) => sum + result.total, 0), rolls: rolls.flatMap(result => result.rolls), modifier: rolls.reduce((sum, result) => sum + result.modifier, 0), formula: damage };
}

function normalizeAction(input: unknown): ActionBlock {
  const action = input && typeof input === "object" ? input as Partial<ActionBlock> : {};
  return {
    name: typeof action.name === "string" ? action.name : "Nova característica",
    description: typeof action.description === "string" ? action.description : "",
    ...(typeof action.attackBonus === "number" && Number.isFinite(action.attackBonus) ? { attackBonus: action.attackBonus } : {}),
    ...(abilityKeys.includes(action.saveAbility as AbilityKey) ? { saveAbility: action.saveAbility as AbilityKey } : {}),
    ...(typeof action.saveDc === "number" && Number.isFinite(action.saveDc) ? { saveDc: action.saveDc } : {}),
    ...(typeof action.damage === "string" ? { damage: action.damage } : {}),
  };
}

export function normalizeEnemy(input: unknown): Enemy | null {
  if (!input || typeof input !== "object") return null;
  const source = input as Partial<Enemy>;
  if (typeof source.name !== "string" || !source.name.trim()) return null;
  const base = defaultEnemy();
  const abilities = source.abilities && typeof source.abilities === "object" ? source.abilities as Partial<Abilities> : {};
  const normalized: Enemy = {
    ...base,
    ...source,
    id: typeof source.id === "string" && source.id ? source.id : createId(),
    name: source.name.trim(),
    concept: typeof source.concept === "string" ? source.concept : "",
    image: typeof source.image === "string" && source.image.startsWith("data:image/") ? source.image : "",
    ruleset: source.ruleset === "2024" ? "2024" : "2014",
    provenance: source.provenance === "SRD" || source.provenance === "Original" ? source.provenance : "Criado por você",
    abilities: {
      for: Number.isFinite(abilities.for) ? Number(abilities.for) : base.abilities.for,
      des: Number.isFinite(abilities.des) ? Number(abilities.des) : base.abilities.des,
      con: Number.isFinite(abilities.con) ? Number(abilities.con) : base.abilities.con,
      int: Number.isFinite(abilities.int) ? Number(abilities.int) : base.abilities.int,
      sab: Number.isFinite(abilities.sab) ? Number(abilities.sab) : base.abilities.sab,
      car: Number.isFinite(abilities.car) ? Number(abilities.car) : base.abilities.car,
    },
    armorClass: Number.isFinite(source.armorClass) ? Number(source.armorClass) : base.armorClass,
    hitPoints: Number.isFinite(source.hitPoints) ? Number(source.hitPoints) : base.hitPoints,
    proficiencyBonus: Number.isFinite(source.proficiencyBonus) ? Number(source.proficiencyBonus) : base.proficiencyBonus,
    traits: Array.isArray(source.traits) ? source.traits.map(normalizeAction) : [],
    actions: Array.isArray(source.actions) ? source.actions.map(normalizeAction) : [],
    reactions: Array.isArray(source.reactions) ? source.reactions.map(normalizeAction) : [],
    legendaryActions: Array.isArray(source.legendaryActions) ? source.legendaryActions.map(normalizeAction) : [],
    createdAt: typeof source.createdAt === "string" ? source.createdAt : base.createdAt,
    updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : base.updatedAt,
  };
  return normalized;
}

const STORAGE_KEY = "bestiario-enemies-v0";
const DRAFT_KEY = "bestiario-enemy-draft-v1";
export function loadEnemies(): Enemy[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return starterEnemies();
    const parsed = JSON.parse(raw) as unknown;
    const imported = Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" && Array.isArray((parsed as { enemies?: unknown }).enemies) ? (parsed as { enemies: unknown[] }).enemies : null;
    if (!imported) return starterEnemies();
    return imported.map(normalizeEnemy).filter((enemy): enemy is Enemy => enemy !== null);
  } catch {
    return starterEnemies();
  }
}

export function saveEnemies(enemies: Enemy[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(enemies));
}

export function loadEnemyDraft(id: string) {
  try {
    const raw = localStorage.getItem(`${DRAFT_KEY}:${id}`);
    return raw ? normalizeEnemy(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveEnemyDraft(enemy: Enemy, key = enemy.id) {
  localStorage.setItem(`${DRAFT_KEY}:${key}`, JSON.stringify(enemy));
}

export function clearEnemyDraft(id: string) {
  localStorage.removeItem(`${DRAFT_KEY}:${id}`);
}
