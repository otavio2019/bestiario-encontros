import { describe, expect, it } from "vitest";
import {
  assessEncounter,
  assessEncounterComposition,
  calculateModifier,
  defaultEnemy,
  encounterMultiplier,
  xpForChallenge,
  suggestEnemyStats,
  actionTemplates,
  balanceWarnings,
  suggestAbilityScores,
  rollDamage,
  rollDice,
} from "./enemy-schema";

function enemyFor(ruleset: "2014" | "2024", challenge: string) {
  return { ...defaultEnemy(), ruleset, challenge };
}

describe("funções básicas de regras", () => {
  it("calcula modificadores de atributo corretamente, inclusive negativos", () => {
    expect(calculateModifier(1)).toBe(-5);
    expect(calculateModifier(9)).toBe(-1);
    expect(calculateModifier(10)).toBe(0);
    expect(calculateModifier(18)).toBe(4);
  });

  it("converte ND fracionário e ND alto em XP", () => {
    expect(xpForChallenge("0")).toBe(10);
    expect(xpForChallenge("1/8")).toBe(25);
    expect(xpForChallenge("1/4")).toBe(50);
    expect(xpForChallenge("1/2")).toBe(100);
    expect(xpForChallenge("20+")).toBe(25000);
    expect(xpForChallenge("inexistente")).toBe(0);
  });

  it("aplica os multiplicadores de quantidade e tamanho da party de 2014", () => {
    expect(encounterMultiplier(1, 4)).toBe(1);
    expect(encounterMultiplier(2, 4)).toBe(1.5);
    expect(encounterMultiplier(6, 4)).toBe(2);
    expect(encounterMultiplier(11, 4)).toBe(3);
    expect(encounterMultiplier(15, 4)).toBe(4);
    expect(encounterMultiplier(2, 2)).toBe(2);
    expect(encounterMultiplier(2, 6)).toBe(1);
  });
});

describe("assessEncounter — D&D 5e 2014", () => {
  it("classifica uma criatura única como fácil para uma party de nível 5", () => {
    const result = assessEncounter(enemyFor("2014", "4"), 5, 4, 1);

    expect(result.xp).toBe(1100);
    expect(result.adjustedXp).toBe(1100);
    expect(result.difficulty).toBe("easy");
    expect(result.label).toBe("Fácil");
    expect(result.budget).toEqual({ easy: 1000, medium: 2000, hard: 3000, deadly: 4400 });
    expect(result.target).toBe(2000);
    expect(result.ratio).toBe(55);
  });

  it("aplica o multiplicador para várias criaturas", () => {
    const result = assessEncounter(enemyFor("2014", "4"), 5, 4, 2);

    expect(result.xp).toBe(2200);
    expect(result.adjustedXp).toBe(3300);
    expect(result.difficulty).toBe("hard");
    expect(result.label).toBe("Difícil");
    expect(result.target).toBe(4400);
    expect(result.ratio).toBe(75);
    expect(result.note).toContain("multiplicador de 1.5×");
  });

  it("classifica um encontro abaixo do limite fácil", () => {
    const result = assessEncounter(enemyFor("2014", "0"), 5, 4, 1);

    expect(result.difficulty).toBe("below");
    expect(result.label).toBe("Abaixo do fácil");
    expect(result.adjustedXp).toBe(10);
    expect(result.target).toBe(1000);
  });
});

describe("assessEncounter — D&D 2024", () => {
  it("usa o orçamento diretamente, sem multiplicador por quantidade", () => {
    const result = assessEncounter(enemyFor("2024", "1"), 5, 4, 4);

    expect(result.xp).toBe(800);
    expect(result.adjustedXp).toBe(800);
    expect(result.difficulty).toBe("low");
    expect(result.label).toBe("Baixa");
    expect(result.budget).toEqual({ low: 2000, moderate: 3000, high: 4400 });
    expect(result.target).toBe(2000);
    expect(result.ratio).toBe(40);
    expect(result.note).toContain("não há multiplicador");
  });

  it("classifica corretamente um encontro acima do orçamento alto", () => {
    const result = assessEncounter(enemyFor("2024", "20+"), 5, 4, 4);

    expect(result.xp).toBe(100000);
    expect(result.adjustedXp).toBe(100000);
    expect(result.difficulty).toBe("over");
    expect(result.label).toBe("Acima do orçamento");
    expect(result.target).toBe(4400);
    expect(result.ratio).toBe(2273);
  });
});

describe("limites de entrada", () => {
  it("limita nível, tamanho da party e quantidade de monstros aos intervalos suportados", () => {
    const normal = assessEncounter(enemyFor("2014", "1"), 1, 1, 1);
    const clamped = assessEncounter(enemyFor("2014", "1"), 0, 0, 0);

    expect(clamped).toEqual(normal);
  });

  it("limita valores acima do intervalo suportado", () => {
    const result = assessEncounter(enemyFor("2024", "20+"), 99, 99, 999);

    expect(result.xp).toBe(2500000);
    expect(result.difficulty).toBe("over");
    expect(result.budget).toEqual({ low: 76800, moderate: 158400, high: 264000 });
  });
});

describe("assessEncounterComposition — vários inimigos", () => {
  it("soma tipos diferentes e aplica o multiplicador pelo total de monstros em 2014", () => {
    const enemies = [
      { ...defaultEnemy(), id: "orc", name: "Orc", challenge: "1/2", ruleset: "2014" as const },
      { ...defaultEnemy(), id: "wolf", name: "Lobo", challenge: "1/4", ruleset: "2014" as const },
    ];
    const result = assessEncounterComposition(enemies, [{ enemyId: "orc", count: 1 }, { enemyId: "wolf", count: 2 }], "2014", 3, 4);

    expect(result.monsterCount).toBe(3);
    expect(result.xp).toBe(200);
    expect(result.adjustedXp).toBe(400);
    expect(result.difficulty).toBe("easy");
    expect(result.lines).toHaveLength(2);
  });

  it("não aplica multiplicador quando a composição usa a matemática de 2024", () => {
    const enemies = [
      { ...defaultEnemy(), id: "orc", name: "Orc", challenge: "1", ruleset: "2014" as const },
      { ...defaultEnemy(), id: "wolf", name: "Lobo", challenge: "1/4", ruleset: "2014" as const },
    ];
    const result = assessEncounterComposition(enemies, [{ enemyId: "orc", count: 2 }, { enemyId: "wolf", count: 2 }], "2024", 5, 4);

    expect(result.monsterCount).toBe(4);
    expect(result.xp).toBe(500);
    expect(result.adjustedXp).toBe(500);
    expect(result.difficulty).toBe("low");
  });
});

describe("suggestEnemyStats — preparação de ficha", () => {
  it("sugere uma base coerente para um atacante", () => {
    const result = suggestEnemyStats("5", "2014", "atacante");

    expect(result.hitPoints).toBe(77);
    expect(result.armorClass).toBe(15);
    expect(result.attackBonus).toBe(7);
    expect(result.saveDc).toBe(15);
    expect(result.damagePerRound).toBe(34);
    expect(result.speed).toBe("9 m");
  });

  it("aumenta resistência e reduz dano para um tanque", () => {
    const result = suggestEnemyStats("5", "2024", "tanque");

    expect(result.hitPoints).toBe(115);
    expect(result.armorClass).toBe(18);
    expect(result.attackBonus).toBe(8);
    expect(result.damagePerRound).toBe(24);
  });
});

describe("rolagens do modo Combate", () => {
  it("interpreta uma fórmula simples de dado", () => {
    const result = rollDice("2d6+3");

    expect(result.rolls).toHaveLength(2);
    expect(result.rolls.every(value => value >= 1 && value <= 6)).toBe(true);
    expect(result.total).toBe(result.rolls[0] + result.rolls[1] + 3);
  });

  it("combina dados de dano em uma ação", () => {
    const result = rollDamage("1d10 + 3 perfurante + 1d6 fogo");

    expect(result.rolls).toHaveLength(2);
    expect(result.total).toBe(result.rolls[0] + result.rolls[1] + 3);
  });
});


describe("revisão automática e biblioteca de habilidades", () => {
  it("gera alertas quando os números fogem muito da faixa do ND", () => {
    const enemy = { ...defaultEnemy(), name: "Colosso", challenge: "2", hitPoints: 200, armorClass: 20, actions: [] };
    const warnings = balanceWarnings(enemy);
    expect(warnings.some(item => item.title === "PV acima da faixa sugerida")).toBe(true);
    expect(warnings.some(item => item.title === "CA muito alta para o ND")).toBe(true);
    expect(warnings.some(item => item.title === "Nenhuma ação cadastrada")).toBe(true);
  });

  it("oferece modelos para ação, passiva, reação e ação lendária", () => {
    expect(actionTemplates.map(item => item.category)).toEqual(expect.arrayContaining(["ação", "passiva", "reação", "lendária"]));
    expect(actionTemplates.every(item => item.name && item.description && item.summary)).toBe(true);
  });
});


describe("atributos recomendados", () => {
  it("prioriza o atributo principal de acordo com a função", () => {
    const attacker = suggestAbilityScores("5", "atacante", "Humanoide");
    const controller = suggestAbilityScores("5", "controlador", "Fada");
    expect(attacker.primary).toBe("for");
    expect(attacker.abilities.for).toBeGreaterThan(attacker.abilities.int);
    expect(controller.primary).toBe("int");
    expect(controller.abilities.int).toBeGreaterThanOrEqual(16);
  });
});


describe("catálogo ampliado de habilidades", () => {
  it("oferece uma biblioteca grande com todas as categorias", () => {
    const categories = new Set(actionTemplates.map(item => item.category));
    expect(actionTemplates.length).toBeGreaterThanOrEqual(30);
    expect(categories).toEqual(new Set(["ação", "passiva", "reação", "lendária"]));
  });
});
