import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { AlertTriangle, ArrowLeft, Check, ChevronDown, Info, Plus, Save, Trash2, Wand2 } from "lucide-react";
import { ActionBlock, actionTemplates, balanceWarnings, abilityKeys, abilityLabels, abilityShortLabels, assessEncounter, calculateModifier, challenges, defaultEnemy, emptyAction, Enemy, loadEnemies, loadEnemyDraft, passiveTemplates, saveEnemies, saveEnemyDraft, sizes, suggestEnemyStats, suggestAbilityScores, creatureTypes, suggestedAttackBonus, suggestedProficiency, suggestedSaveDc, validateEnemy, formatModifier, EnemyRole } from "@/lib/enemy-schema";

function NumberField({ label, value, onChange, suffix }: { label: string; value: number; onChange: (value: number) => void; suffix?: string }) {
  return <label className="field-label"><span>{label}</span><div className="number-input"><input type="number" value={value} onChange={event => onChange(Number(event.target.value))} />{suffix && <small>{suffix}</small>}</div></label>;
}

function ActionEditor({ title, items, onChange, addLabel }: { title: string; items: ActionBlock[]; onChange: (items: ActionBlock[]) => void; addLabel: string }) {
  function update(index: number, patch: Partial<ActionBlock>) { onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item)); }
  return <section className="editor-section"><div className="section-title"><div><span className="eyebrow">BLOCO DE REGRAS</span><h2>{title}</h2></div><button className="small-button" onClick={() => onChange([...items, emptyAction()])}><Plus size={15} /> {addLabel}</button></div>{items.length === 0 && <p className="section-empty">Nenhum bloco adicionado. Use o botão acima para começar.</p>}{items.map((item, index) => <div className="action-editor" key={`${title}-${index}`}><div className="action-head"><input className="action-name" value={item.name} onChange={event => update(index, { name: event.target.value })} /><button className="danger-button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remover ${item.name}`}><Trash2 size={15} /></button></div><textarea value={item.description} onChange={event => update(index, { description: event.target.value })} rows={3} placeholder="Descreva o efeito, alcance, dano ou teste de resistência..." /><div className="action-fields"><label className="field-label"><span>Bônus de ataque</span><input type="number" value={item.attackBonus ?? ""} placeholder="—" onChange={event => update(index, { attackBonus: event.target.value === "" ? undefined : Number(event.target.value) })} /></label><label className="field-label"><span>Habilidade da CD</span><select value={item.saveAbility ?? ""} onChange={event => update(index, { saveAbility: (event.target.value || undefined) as ActionBlock["saveAbility"] })}><option value="">—</option>{abilityKeys.map(key => <option key={key} value={key}>{abilityShortLabels[key]}</option>)}</select></label><label className="field-label"><span>CD</span><input type="number" value={item.saveDc ?? ""} placeholder="—" onChange={event => update(index, { saveDc: event.target.value === "" ? undefined : Number(event.target.value) })} /></label><label className="field-label wide"><span>Dano</span><input value={item.damage ?? ""} placeholder="ex.: 1d8 + 3 cortante" onChange={event => update(index, { damage: event.target.value })} /></label></div></div>)}</section>;
}

export default function EnemyEditor() {
  const [, params] = useRoute("/inimigos/:id");
  const [, editParams] = useRoute("/inimigos/:id/editar");
  const [, navigate] = useLocation();
  const enemyId = editParams?.id ?? params?.id;
  const isNew = !enemyId || enemyId === "novo";
  const [enemy, setEnemy] = useState<Enemy>(() => {
    const draft = loadEnemyDraft(isNew ? "new" : enemyId!);
    if (draft) return draft;
    if (isNew) return defaultEnemy();
    return loadEnemies().find(item => item.id === enemyId) ?? defaultEnemy();
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [autosaveState, setAutosaveState] = useState<"salvando" | "salvo">("salvo");
  const [passiveTemplate, setPassiveTemplate] = useState("");
  const [actionTemplate, setActionTemplate] = useState("");
  const [statRole, setStatRole] = useState<EnemyRole>("atacante");
  const [partyLevel, setPartyLevel] = useState(5);
  const [partyCount, setPartyCount] = useState(4);
  const [monsterCount, setMonsterCount] = useState(1);

  useEffect(() => {
    if (!isNew) {
      const found = loadEnemies().find(item => item.id === enemyId);
      if (found) setEnemy(found);
    }
  }, [isNew, enemyId]);

  useEffect(() => {
    setAutosaveState("salvando");
    const timer = window.setTimeout(() => {
      saveEnemyDraft(enemy, isNew ? "new" : enemy.id);
      if (!isNew) {
        const current = loadEnemies();
        if (current.some(item => item.id === enemy.id) && validateEnemy(enemy).length === 0) {
          saveEnemies(current.map(item => item.id === enemy.id ? enemy : item));
        }
      }
      setAutosaveState("salvo");
    }, 650);
    return () => window.clearTimeout(timer);
  }, [enemy, isNew]);

  const suggested = useMemo(() => suggestedProficiency(enemy.challenge), [enemy.challenge]);
  const encounter = useMemo(() => assessEncounter(enemy, partyLevel, partyCount, monsterCount), [enemy, partyLevel, partyCount, monsterCount]);
  const statSuggestions = useMemo(() => suggestEnemyStats(enemy.challenge, enemy.ruleset, statRole), [enemy.challenge, enemy.ruleset, statRole]);
  const abilitySuggestions = useMemo(() => suggestAbilityScores(enemy.challenge, statRole, enemy.type), [enemy.challenge, enemy.type, statRole]);
  const warnings = useMemo(() => balanceWarnings(enemy), [enemy]);
  function update(patch: Partial<Enemy>) { setEnemy(current => ({ ...current, ...patch, updatedAt: new Date().toISOString() })); setSaved(false); }
  function updateAbility(key: keyof Enemy["abilities"], value: number) { update({ abilities: { ...enemy.abilities, [key]: value } }); }
  function save() {
    const nextErrors = validateEnemy(enemy);
    setErrors(nextErrors);
    if (nextErrors.length) return;
    const current = loadEnemies();
    saveEnemies(isNew ? [enemy, ...current] : current.map(item => item.id === enemy.id ? enemy : item));
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
    if (isNew) navigate(`/inimigos/${enemy.id}`);
  }
  function applySuggestedProficiency() { update({ proficiencyBonus: suggested }); }
  function applyAbilitySuggestions() { update({ abilities: { ...abilitySuggestions.abilities } }); }
  function addPassive() {
    const template = passiveTemplates.find(item => item.name === passiveTemplate);
    if (!template) return;
    update({ traits: [...enemy.traits, { name: template.name, description: template.description }] });
    setPassiveTemplate("");
  }
  function addActionTemplate() {
    const template = actionTemplates.find(item => item.name === actionTemplate);
    if (!template) return;
    const { category: _, summary: __, ...action } = template;
    const target = template.category === "passiva" ? "traits" : template.category === "reação" ? "reactions" : template.category === "lendária" ? "legendaryActions" : "actions";
    update({ [target]: [...enemy[target], { ...action }] } as Partial<Enemy>);
    setActionTemplate("");
  }
  function applyStatSuggestions() {
    update({ hitPoints: statSuggestions.hitPoints, hitDice: statSuggestions.hitDice, armorClass: statSuggestions.armorClass, speed: statSuggestions.speed, proficiencyBonus: statSuggestions.proficiencyBonus });
  }

  return <div className="editor-shell"><header className="editor-topbar"><Link href="/" className="back-link"><ArrowLeft size={17} /> Voltar à biblioteca</Link><div className="editor-actions"><span className="save-state">{saved ? <><Check size={15} /> Salvo</> : autosaveState === "salvando" ? "Salvando rascunho…" : "Rascunho salvo automaticamente"}</span><button className="primary-button compact" onClick={save}><Save size={16} /> Salvar ficha</button></div></header><main className="editor-main"><div className="editor-header"><div><div className="eyebrow"><span className="eyebrow-line" /> {isNew ? "NOVA FICHA" : "EDITANDO FICHA"}</div><h1>{isNew ? "Dê forma ao próximo encontro." : enemy.name || "Ficha sem nome"}</h1><p>Preencha o essencial primeiro. O resto pode ganhar detalhes durante a preparação.</p></div><div className="rules-switch"><span>Versão de regras</span><div className="segmented"><button className={enemy.ruleset === "2014" ? "active" : ""} onClick={() => update({ ruleset: "2014" })}>5e · 2014</button><button className={enemy.ruleset === "2024" ? "active" : ""} onClick={() => update({ ruleset: "2024" })}>D&D · 2024</button></div></div></div>{errors.length > 0 && <div className="error-box" role="alert"><strong>Antes de salvar:</strong><ul>{errors.map(error => <li key={error}>{error}</li>)}</ul></div>}

<section className="editor-section identity-section"><div className="section-title"><div><span className="eyebrow">01 · IDENTIDADE</span><h2>Quem está entrando em cena?</h2></div><span className="completion-dot"><Check size={13} /></span></div><div className="form-grid two"><label className="field-label wide"><span>Nome do inimigo <b>*</b></span><input className="large-input" value={enemy.name} onChange={event => update({ name: event.target.value })} placeholder="ex.: Cavaleiro da Cinza" /></label><label className="field-label wide"><span>Conceito curto <b>*</b></span><input value={enemy.concept} onChange={event => update({ concept: event.target.value })} placeholder="ex.: guardião que troca memórias por passagem" /></label><label className="field-label"><span>Tamanho</span><select value={enemy.size} onChange={event => update({ size: event.target.value })}>{sizes.map(item => <option key={item}>{item}</option>)}</select></label><label className="field-label"><span>Tipo</span><select value={enemy.type} onChange={event => update({ type: event.target.value })}>{creatureTypes.map(item => <option key={item}>{item}</option>)}</select></label><label className="field-label"><span>Alinhamento</span><input value={enemy.alignment} onChange={event => update({ alignment: event.target.value })} placeholder="ex.: Neutro e mau" /></label><label className="field-label"><span>Procedência</span><select value={enemy.provenance} onChange={event => update({ provenance: event.target.value as Enemy["provenance"] })}><option>SRD</option><option>Original</option><option>Criado por você</option></select></label></div></section>

<section className="editor-section"><div className="section-title"><div><span className="eyebrow">02 · DEFESA E RITMO</span><h2>Números que guiam o combate</h2></div></div><div className="stat-preparer"><div><span className="eyebrow">CALCULADOR DE ESTATÍSTICAS</span><p>Escolha a função para receber uma base de CA, PV, movimento, ataque, CD e dano médio.</p></div><div className="stat-preparer-controls"><label className="field-label"><span>Função</span><select value={statRole} onChange={event => setStatRole(event.target.value as EnemyRole)}><option value="atacante">Atacante</option><option value="tanque">Tanque</option><option value="controlador">Controlador</option><option value="suporte">Suporte</option><option value="chefe">Chefe</option></select></label><button className="small-button" onClick={applyStatSuggestions}>Aplicar base sugerida</button></div><div className="stat-suggestion-grid"><div><span>PV</span><b>{statSuggestions.hitPoints}</b><small>{statSuggestions.hitDice}</small></div><div><span>CA</span><b>{statSuggestions.armorClass}</b></div><div><span>Ataque</span><b>+{statSuggestions.attackBonus}</b></div><div><span>CD</span><b>{statSuggestions.saveDc}</b></div><div><span>Dano médio</span><b>{statSuggestions.damagePerRound}</b><small>/ rodada</small></div><div><span>Proficiência</span><b>+{statSuggestions.proficiencyBonus}</b></div></div><p className="stat-suggestion-note">{statSuggestions.note}</p></div><div className="form-grid four"><NumberField label="Classe de armadura" value={enemy.armorClass} onChange={value => update({ armorClass: value })} /><NumberField label="Pontos de vida" value={enemy.hitPoints} onChange={value => update({ hitPoints: value })} /><label className="field-label"><span>Dado de vida</span><input value={enemy.hitDice} onChange={event => update({ hitDice: event.target.value })} placeholder="ex.: 8d8 + 16" /></label><label className="field-label"><span>Deslocamento</span><input value={enemy.speed} onChange={event => update({ speed: event.target.value })} placeholder="ex.: 9 m, voo 12 m" /></label></div><div className="form-grid three subform"><label className="field-label"><span>Resistências</span><input value={enemy.resistances} onChange={event => update({ resistances: event.target.value })} placeholder="—" /></label><label className="field-label"><span>Imunidades</span><input value={enemy.immunities} onChange={event => update({ immunities: event.target.value })} placeholder="—" /></label><label className="field-label"><span>Testes de resistência</span><input value={enemy.savingThrows} onChange={event => update({ savingThrows: event.target.value })} placeholder="ex.: DES +5" /></label></div></section>

<section className="editor-section"><div className="section-title"><div><span className="eyebrow">03 · ATRIBUTOS</span><h2>O perfil da criatura</h2></div><div className="suggestion-label"><Wand2 size={14} /> modificadores automáticos</div></div><div className="ability-recommender"><div><span className="eyebrow">ATRIBUTOS RECOMENDADOS</span><p>{abilitySuggestions.note}</p></div><button className="small-button" onClick={applyAbilitySuggestions}>Aplicar recomendação</button><div className="recommended-ability-grid">{abilityKeys.map(key => <div className={key === abilitySuggestions.primary ? "primary-ability" : key === abilitySuggestions.secondary ? "secondary-ability" : ""} key={`recommended-${key}`}><span>{abilityShortLabels[key]}</span><b>{abilitySuggestions.abilities[key]}</b><small>{formatModifier(calculateModifier(abilitySuggestions.abilities[key]))}</small></div>)}</div></div><div className="ability-grid">{abilityKeys.map(key => <div className="ability-card" key={key}><span>{abilityShortLabels[key]}</span><input type="number" value={enemy.abilities[key]} onChange={event => updateAbility(key, Number(event.target.value))} /><strong>{formatModifier(calculateModifier(enemy.abilities[key]))}</strong><small>{abilityLabels[key]}</small></div>)}</div><div className="form-grid three subform"><label className="field-label"><span>Perícias</span><input value={enemy.skills} onChange={event => update({ skills: event.target.value })} placeholder="ex.: Furtividade +5" /></label><label className="field-label"><span>Sentidos</span><input value={enemy.senses} onChange={event => update({ senses: event.target.value })} placeholder="ex.: visão no escuro 18 m" /></label><label className="field-label"><span>Idiomas</span><input value={enemy.languages} onChange={event => update({ languages: event.target.value })} placeholder="ex.: Comum, Silvestre" /></label></div></section>

<section className="editor-section"><div className="section-title"><div><span className="eyebrow">04 · NÍVEL DE DESAFIO</span><h2>O peso da ameaça</h2></div></div><div className="challenge-row"><label className="field-label challenge-field"><span>Nível de desafio <b>*</b></span><select value={enemy.challenge} onChange={event => update({ challenge: event.target.value })}>{challenges.map(item => <option key={item}>{item}</option>)}</select></label><div className="suggestion-card"><div><span>Bônus de proficiência sugerido</span><strong>+{suggested}</strong></div><button className="small-button" onClick={applySuggestedProficiency}>Aplicar sugestão</button></div><NumberField label="Bônus usado na ficha" value={enemy.proficiencyBonus} onChange={value => update({ proficiencyBonus: value })} /></div><div className="calc-hints"><span><Wand2 size={14} /> CD de {abilityShortLabels.sab}: <b>{suggestedSaveDc(enemy, "sab")}</b></span><span><Wand2 size={14} /> ataque de FOR: <b>{formatModifier(suggestedAttackBonus(enemy, "for"))}</b></span><small>Sugestões não travam seus valores.</small></div></section>

<section className="editor-section encounter-section"><div className="section-title"><div><span className="eyebrow">05 · TESTE DE ENCONTRO</span><h2>Isso está forte para a party?</h2></div><div className="encounter-xp">{encounter.xp.toLocaleString("pt-BR")} XP base</div></div><p className="encounter-intro">Coloque o nível e o tamanho da party. O cálculo usa a matemática da versão selecionada e estima o peso desta quantidade de inimigos.</p><div className="form-grid three encounter-inputs"><label className="field-label"><span>Nível da party</span><input type="number" min="1" max="20" value={partyLevel} onChange={event => setPartyLevel(Number(event.target.value))} /></label><label className="field-label"><span>Quantidade de personagens</span><input type="number" min="1" max="12" value={partyCount} onChange={event => setPartyCount(Number(event.target.value))} /></label><label className="field-label"><span>Quantidade deste inimigo</span><input type="number" min="1" max="100" value={monsterCount} onChange={event => setMonsterCount(Number(event.target.value))} /></label></div><div className={`encounter-result result-${encounter.difficulty}`}><div className="result-main"><span className="result-kicker">ESTIMATIVA PARA {partyCount} PERSONAGENS · NÍVEL {partyLevel}</span><strong>{encounter.label}</strong><p>{encounter.ratio}% do próximo limite de dificuldade</p></div><div className="result-numbers"><div><span>XP considerado</span><b>{encounter.adjustedXp.toLocaleString("pt-BR")}</b></div><div><span>Meta seguinte</span><b>{encounter.target.toLocaleString("pt-BR")}</b></div></div></div><p className="encounter-note">{encounter.note} É uma estimativa: terreno, recursos gastos, composição da party e habilidades especiais podem mudar bastante o resultado.</p></section>
{warnings.length > 0 && <section className="editor-section balance-panel"><div className="section-title"><div><span className="eyebrow">REVISÃO AUTOMÁTICA</span><h2>Olho de balanceamento</h2></div><AlertTriangle size={20} /></div><p className="encounter-intro">São sugestões baseadas no ND informado. Elas não bloqueiam a ficha e não substituem o julgamento do mestre.</p><div className="warning-list">{warnings.map((warning, index) => <div className={`balance-warning ${warning.level}`} key={`${warning.title}-${index}`}>{warning.level === "info" ? <Info size={16} /> : <AlertTriangle size={16} />}<div><strong>{warning.title}</strong><p>{warning.detail}</p></div></div>)}</div></section>}
<section className="editor-section action-library"><div className="section-title"><div><span className="eyebrow">BIBLIOTECA DE HABILIDADES</span><h2>Comece com um modelo reutilizável</h2></div><Wand2 size={19} /></div><p className="encounter-intro">Adicione ações, reações, passivas e ações lendárias prontas; depois edite o texto e os números na ficha.</p><div className="action-library-row"><select value={actionTemplate} onChange={event => setActionTemplate(event.target.value)}><option value="">Escolha uma habilidade…</option>{actionTemplates.map(item => <option key={item.name} value={item.name}>{item.name} · {item.category}</option>)}</select><button className="small-button" onClick={addActionTemplate} disabled={!actionTemplate}><Plus size={15} /> Adicionar modelo</button></div>{actionTemplate && <p className="template-summary">{actionTemplates.find(item => item.name === actionTemplate)?.summary}</p>}</section>
<section className="editor-section passive-builder"><div className="section-title"><div><span className="eyebrow">PREPARADOR DE PASSIVAS</span><h2>Adicione uma habilidade pronta</h2></div><span className="suggestion-label"><Wand2 size={14} /> sugestões editáveis</span></div><p className="encounter-intro">Escolha um ponto de partida; depois ajuste números e texto para combinar com sua criatura.</p><div className="passive-row"><select value={passiveTemplate} onChange={event => setPassiveTemplate(event.target.value)}><option value="">Escolha uma passiva…</option>{passiveTemplates.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}</select><button className="small-button" onClick={addPassive} disabled={!passiveTemplate}><Plus size={15} /> Adicionar passiva</button></div></section><ActionEditor title="Características" items={enemy.traits} onChange={traits => update({ traits })} addLabel="Adicionar característica" /><ActionEditor title="Ações" items={enemy.actions} onChange={actions => update({ actions })} addLabel="Adicionar ação" /><ActionEditor title="Reações" items={enemy.reactions} onChange={reactions => update({ reactions })} addLabel="Adicionar reação" /><ActionEditor title="Ações lendárias" items={enemy.legendaryActions} onChange={legendaryActions => update({ legendaryActions })} addLabel="Adicionar ação lendária" />

<section className="editor-section"><div className="section-title"><div><span className="eyebrow">09 · NOTAS DO MESTRE</span><h2>O que não cabe na ficha?</h2></div></div><textarea className="notes-area" rows={5} value={enemy.notes} onChange={event => update({ notes: event.target.value })} placeholder="Táticas, pistas de interpretação, terreno favorito, gatilhos narrativos..." /></section><div className="editor-bottom"><Link href="/" className="back-link">Cancelar</Link><button className="primary-button" onClick={save}><Save size={17} /> {isNew ? "Salvar na biblioteca" : "Salvar alterações"}</button></div></main></div>;
}
