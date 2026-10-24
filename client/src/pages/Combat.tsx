import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Dices, Heart, Plus, RotateCcw, Shield, Swords, Trash2 } from "lucide-react";
import { calculateModifier, EncounterEntry, Enemy, loadEnemies, rollDamage, rollDice } from "@/lib/enemy-schema";

type Combatant = { id: string; enemyId: string; name: string; hp: number; maxHp: number; initiative: number; enemy: Enemy };

type LogItem = { id: number; text: string; tone?: "hit" | "damage" | "info" };

export default function Combat() {
  const enemies = useMemo(() => loadEnemies(), []);
  const [entries, setEntries] = useState<EncounterEntry[]>(enemies[0] ? [{ enemyId: enemies[0].id, count: 1 }] : []);
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [round, setRound] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);

  function addEntry() { setEntries(current => [...current, { enemyId: enemies[0]?.id ?? "", count: 1 }]); }
  function updateEntry(index: number, patch: Partial<EncounterEntry>) { setEntries(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item)); }
  function removeEntry(index: number) { setEntries(current => current.filter((_, itemIndex) => itemIndex !== index)); }
  function addLog(text: string, tone: LogItem["tone"] = "info") { setLogs(current => [{ id: Date.now() + Math.random(), text, tone }, ...current].slice(0, 30)); }

  function startCombat() {
    const next: Combatant[] = [];
    entries.forEach(entry => {
      const enemy = enemies.find(item => item.id === entry.enemyId);
      if (!enemy) return;
      for (let index = 0; index < Math.max(1, Math.min(100, entry.count)); index += 1) {
        const roll = rollDice("1d20");
        next.push({ id: `${enemy.id}-${index}-${Date.now()}`, enemyId: enemy.id, name: entry.count > 1 ? `${enemy.name} ${index + 1}` : enemy.name, hp: enemy.hitPoints, maxHp: enemy.hitPoints, initiative: roll.total + calculateModifier(enemy.abilities.des), enemy });
      }
    });
    next.sort((a, b) => b.initiative - a.initiative);
    setCombatants(next);
    setActiveId(next[0]?.id ?? null);
    setTargetId(next.find(item => item.id !== next[0]?.id)?.id ?? null);
    setRound(1);
    setLogs([]);
    addLog(`${next.length} combatente(s) entraram na iniciativa.`, "info");
  }

  function updateHp(id: string, value: number) { setCombatants(current => current.map(item => item.id === id ? { ...item, hp: Math.max(0, Math.min(item.maxHp, value)) } : item)); }
  function nextRound() {
    setRound(value => value + 1);
    if (combatants.length) {
      const currentIndex = combatants.findIndex(item => item.id === activeId);
      setActiveId(combatants[(currentIndex + 1) % combatants.length]?.id ?? null);
    }
    addLog(`Rodada ${round + 1} começou.`, "info");
  }
  function useAction(combatant: Combatant, actionName: string, attackBonus?: number, damage?: string) {
    if (attackBonus === undefined && !damage) { addLog(`${combatant.name}: ${actionName}.`); return; }
    const target = combatants.find(item => item.id === targetId && item.hp > 0);
    const attack = attackBonus === undefined ? null : rollDice(`1d20${attackBonus >= 0 ? "+" : ""}${attackBonus}`);
    const hit = attack && target ? attack.total >= target.enemy.armorClass : undefined;
    const damageResult = damage && (hit !== false) ? rollDamage(damage) : null;
    const parts = [`${combatant.name} — ${actionName}`];
    if (attack) parts.push(`ataque ${attack.total} [${attack.rolls.join(", ")}${attack.modifier ? ` ${attack.modifier >= 0 ? "+" : ""}${attack.modifier}` : ""}]`);
    if (target) parts.push(hit ? `acerto contra CA ${target.enemy.armorClass}` : `erro contra CA ${target.enemy.armorClass}`);
    if (damageResult && target) { parts.push(`dano ${damageResult.total} (${damage})`); updateHp(target.id, target.hp - damageResult.total); }
    addLog(parts.join(" · "), damageResult ? "damage" : hit === false ? "info" : "hit");
  }

  return <div className="combat-shell"><header className="editor-topbar"><Link href="/" className="back-link"><ArrowLeft size={17} /> Voltar à biblioteca</Link><div className="editor-actions"><span className="save-state"><Dices size={14} /> Rodadas: {round}</span><Link href="/encontros" className="secondary-button">Calculadora</Link></div></header><main className="combat-main"><div className="eyebrow"><span className="eyebrow-line" /> MODO COMBATE</div><div className="combat-heading"><div><h1>Use seus inimigos na mesa.</h1><p>Iniciativa, pontos de vida, ações e dados em um único lugar.</p></div><div className="combat-heading-actions"><button className="secondary-button" onClick={nextRound} disabled={!combatants.length}>Próxima rodada</button><button className="primary-button" onClick={startCombat}><Swords size={16} /> {combatants.length ? "Reiniciar combate" : "Começar combate"}</button></div></div>{!combatants.length && <section className="encounter-card combat-setup"><div className="section-title"><div><span className="eyebrow">PREPARAÇÃO</span><h2>Escolha os inimigos</h2></div><button className="small-button" onClick={addEntry}><Plus size={15} /> Adicionar</button></div>{entries.map((entry, index) => <div className="combat-entry" key={`${entry.enemyId}-${index}`}><select value={entry.enemyId} onChange={event => updateEntry(index, { enemyId: event.target.value })}>{enemies.map(enemy => <option key={enemy.id} value={enemy.id}>{enemy.name} · ND {enemy.challenge}</option>)}</select><label className="field-label"><span>Quantidade</span><input type="number" min="1" max="100" value={entry.count} onChange={event => updateEntry(index, { count: Number(event.target.value) })} /></label><button className="danger-button" onClick={() => removeEntry(index)} disabled={entries.length <= 1} aria-label="Remover inimigo"><Trash2 size={16} /></button></div>)}<p className="encounter-note">Ao começar, cada criatura recebe iniciativa automaticamente com 1d20 + Destreza.</p></section>}{combatants.length > 0 && <div className="combat-layout"><section className="combat-roster"><div className="combat-controls"><label className="field-label"><span>Ativo</span><select value={activeId ?? ""} onChange={event => setActiveId(event.target.value)}>{combatants.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label className="field-label"><span>Alvo</span><select value={targetId ?? ""} onChange={event => setTargetId(event.target.value)}><option value="">Sem alvo</option>{combatants.filter(item => item.hp > 0).map(item => <option value={item.id} key={item.id}>{item.name} · CA {item.enemy.armorClass}</option>)}</select></label></div><div className="section-title"><div><span className="eyebrow">RODADA {round}</span><h2>Ordem de iniciativa</h2></div><button className="small-button" onClick={startCombat}><RotateCcw size={14} /> Rolar novamente</button></div>{combatants.map(combatant => <article className={`combatant-card ${combatant.hp === 0 ? "defeated" : ""} ${combatant.id === activeId ? "active-turn" : ""}`} key={combatant.id}><div className="combatant-top"><div><h3>{combatant.name}</h3><span>Iniciativa <b>{combatant.initiative}</b> · CA {combatant.enemy.armorClass}</span></div><div className="initiative-badge">{combatant.initiative}</div></div><div className="hp-row"><Heart size={15} /><input type="number" value={combatant.hp} onChange={event => updateHp(combatant.id, Number(event.target.value))} /><span>/ {combatant.maxHp} PV</span><div className="hp-bar"><i style={{ width: `${Math.max(0, (combatant.hp / combatant.maxHp) * 100)}%` }} /></div></div><div className="combat-actions">{combatant.enemy.actions.map((action, index) => <button key={`${combatant.id}-action-${index}`} className="action-roll-button" onClick={() => useAction(combatant, action.name, action.attackBonus, action.damage)}><Dices size={13} /><span>{action.name}</span>{action.damage && <small>{action.damage}</small>}</button>)}</div></article>)}</section><aside className="combat-log"><div className="section-title"><div><span className="eyebrow">REGISTRO</span><h2>Rolagens</h2></div><Shield size={19} /></div>{logs.length === 0 ? <p className="section-empty">As rolagens aparecerão aqui.</p> : <div className="log-list">{logs.map(log => <div className={`log-item ${log.tone ?? ""}`} key={log.id}>{log.text}</div>)}</div>}</aside></div>}</main></div>;
}
