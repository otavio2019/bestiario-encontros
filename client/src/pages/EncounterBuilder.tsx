import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Plus, Trash2, Swords, Save } from "lucide-react";
import { assessEncounterComposition, EncounterEntry, Enemy, loadEnemies } from "@/lib/enemy-schema";

const STORAGE_KEY = "bestiario-encounter-draft-v1";

type EncounterDraft = { ruleset: "2014" | "2024"; partyLevel: number; partyCount: number; entries: EncounterEntry[] };

function readDraft(enemies: Enemy[]): EncounterDraft {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<EncounterDraft> | null;
    if (parsed && Array.isArray(parsed.entries)) {
      const entries = parsed.entries.filter(item => enemies.some(enemy => enemy.id === item.enemyId)).map(item => ({ enemyId: item.enemyId, count: Math.max(1, Number(item.count) || 1) }));
      if (entries.length) return { ruleset: parsed.ruleset === "2024" ? "2024" : "2014", partyLevel: Number(parsed.partyLevel) || 5, partyCount: Number(parsed.partyCount) || 4, entries };
    }
  } catch { /* usa os valores iniciais */ }
  return { ruleset: "2014", partyLevel: 5, partyCount: 4, entries: enemies[0] ? [{ enemyId: enemies[0].id, count: 1 }] : [] };
}

export default function EncounterBuilder() {
  const enemies = useMemo(() => loadEnemies(), []);
  const [draft, setDraft] = useState<EncounterDraft>(() => readDraft(enemies));
  const result = useMemo(() => assessEncounterComposition(enemies, draft.entries, draft.ruleset, draft.partyLevel, draft.partyCount), [enemies, draft]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  function update(patch: Partial<EncounterDraft>) { setDraft(current => ({ ...current, ...patch })); }
  function addLine() { update({ entries: [...draft.entries, { enemyId: enemies[0]?.id ?? "", count: 1 }] }); }
  function updateLine(index: number, patch: Partial<EncounterEntry>) { update({ entries: draft.entries.map((line, lineIndex) => lineIndex === index ? { ...line, ...patch } : line) }); }
  function removeLine(index: number) { update({ entries: draft.entries.filter((_, lineIndex) => lineIndex !== index) }); }

  return <div className="encounter-shell"><header className="editor-topbar"><Link href="/" className="back-link"><ArrowLeft size={17} /> Voltar à biblioteca</Link><div className="editor-actions"><span className="save-state"><Save size={14} /> Rascunho salvo automaticamente</span><Link href="/inimigos/novo" className="secondary-button">Criar inimigo</Link></div></header><main className="encounter-main"><div className="eyebrow"><span className="eyebrow-line" /> CALCULADORA DE ENCONTRO</div><div className="encounter-heading"><div><h1>Monte a batalha antes da sessão.</h1><p>Combine inimigos diferentes e veja o peso do encontro para a sua party.</p></div><div className="rules-switch"><span>Versão do cálculo</span><div className="segmented"><button className={draft.ruleset === "2014" ? "active" : ""} onClick={() => update({ ruleset: "2014" })}>5e · 2014</button><button className={draft.ruleset === "2024" ? "active" : ""} onClick={() => update({ ruleset: "2024" })}>D&D · 2024</button></div></div></div><section className="encounter-card party-card"><div className="section-title"><div><span className="eyebrow">01 · SUA PARTY</span><h2>Quem vai enfrentar isso?</h2></div><Swords size={22} /></div><div className="form-grid two"><label className="field-label"><span>Nível dos personagens</span><input type="number" min="1" max="20" value={draft.partyLevel} onChange={event => update({ partyLevel: Number(event.target.value) })} /></label><label className="field-label"><span>Quantidade de personagens</span><input type="number" min="1" max="12" value={draft.partyCount} onChange={event => update({ partyCount: Number(event.target.value) })} /></label></div></section><section className="encounter-card"><div className="section-title"><div><span className="eyebrow">02 · COMPOSIÇÃO</span><h2>Quem está entrando em cena?</h2></div><button className="small-button" onClick={addLine}><Plus size={15} /> Adicionar inimigo</button></div><div className="composition-list">{draft.entries.map((line, index) => <div className="composition-row" key={`${line.enemyId}-${index}`}><select value={line.enemyId} onChange={event => updateLine(index, { enemyId: event.target.value })}>{enemies.map(enemy => <option value={enemy.id} key={enemy.id}>{enemy.name} · ND {enemy.challenge}</option>)}</select><label className="field-label"><span>Quantidade</span><input type="number" min="1" max="100" value={line.count} onChange={event => updateLine(index, { count: Number(event.target.value) })} /></label><button className="danger-button" onClick={() => removeLine(index)} aria-label="Remover inimigo" disabled={draft.entries.length <= 1}><Trash2 size={16} /></button></div>)}</div></section><section className={`encounter-card composition-result result-${result.difficulty}`}><div className="result-main"><span className="result-kicker">RESULTADO PARA {draft.partyCount} PERSONAGENS · NÍVEL {draft.partyLevel}</span><strong>{result.label}</strong><p>{result.ratio}% da próxima faixa de dificuldade</p></div><div className="result-numbers"><div><span>Inimigos</span><b>{result.monsterCount}</b></div><div><span>XP base</span><b>{result.xp.toLocaleString("pt-BR")}</b></div><div><span>XP considerado</span><b>{result.adjustedXp.toLocaleString("pt-BR")}</b></div></div><p className="encounter-note">{result.note}</p><div className="breakdown-list"><span className="eyebrow">PESO POR INIMIGO</span>{result.lines.map(line => <div key={line.enemyId}><span>{line.count}× {line.name} <small>ND {line.challenge}</small></span><b>{line.xp.toLocaleString("pt-BR")} XP</b></div>)}</div></section><p className="encounter-disclaimer">A calculadora é uma estimativa. Terreno, recursos gastos, composição da party, ações especiais e monstros muito acima do nível dos personagens podem mudar bastante o resultado.</p></main></div>;
}
