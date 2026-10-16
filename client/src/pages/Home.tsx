import { useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, ChevronRight, Copy, Download, Filter, Grid3X3, List, Plus, Search, Sparkles, Trash2, Upload, Wand2 } from "lucide-react";
import { challengeToNumber, createId, Enemy, loadEnemies, normalizeEnemy, saveEnemies } from "@/lib/enemy-schema";

const provenanceTone: Record<Enemy["provenance"], string> = {
  SRD: "badge-moss",
  Original: "badge-copper",
  "Criado por você": "badge-ink",
};

function friendlyCount(count: number) {
  return count.toString().padStart(2, "0");
}

export default function Home() {
  const [, navigate] = useLocation();
  const [enemies, setEnemies] = useState<Enemy[]>(() => loadEnemies());
  const [query, setQuery] = useState("");
  const [ruleset, setRuleset] = useState<"Todos" | "2014" | "2024">("Todos");
  const [type, setType] = useState("Todos");
  const [size, setSize] = useState("Todos");
  const [challenge, setChallenge] = useState("Todos");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const types = Array.from(new Set(enemies.map(enemy => enemy.type))).sort();
  const sizes = Array.from(new Set(enemies.map(enemy => enemy.size))).sort();
  const challenges = Array.from(new Set(enemies.map(enemy => enemy.challenge))).sort((a, b) => challengeToNumber(a) - challengeToNumber(b));

  const filtered = useMemo(() => enemies.filter(enemy => {
    const text = `${enemy.name} ${enemy.concept} ${enemy.type}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase()))
      && (ruleset === "Todos" || enemy.ruleset === ruleset)
      && (type === "Todos" || enemy.type === type)
      && (size === "Todos" || enemy.size === size)
      && (challenge === "Todos" || enemy.challenge === challenge);
  }), [enemies, query, ruleset, type, size, challenge]);

  function commit(next: Enemy[]) {
    setEnemies(next);
    saveEnemies(next);
  }

  function duplicate(enemy: Enemy) {
    const copy: Enemy = { ...enemy, id: createId(), name: `${enemy.name} — cópia`, provenance: "Criado por você", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    commit([copy, ...enemies]);
  }

  function remove(enemy: Enemy) {
    if (!window.confirm(`Remover “${enemy.name}” da sua biblioteca?`)) return;
    commit(enemies.filter(item => item.id !== enemy.id));
  }

  function exportLibrary() {
    const blob = new Blob([JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), enemies }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bestiario-de-encontros.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importLibrary(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result));
        const imported = Array.isArray(payload) ? payload : payload?.enemies;
        if (!Array.isArray(imported)) throw new Error("Formato inválido");
        const normalized = imported.map(item => normalizeEnemy(item)).filter((item): item is Enemy => item !== null).map(item => ({ ...item, id: createId(), provenance: "Criado por você" as const }));
        if (!normalized.length) throw new Error("Nenhum inimigo válido");
        commit([...normalized, ...enemies]);
        window.alert(`${normalized.length} inimigo(s) importado(s).`);
      } catch {
        window.alert("Não foi possível importar. Use um JSON exportado pelo Bestiário.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark"><span>BE</span><div><strong>Bestiário</strong><small>de encontros</small></div></div>
        <div className="sidebar-rule" />
        <nav className="nav-stack" aria-label="Navegação principal">
          <a className="nav-item active" href="#biblioteca"><BookOpen size={17} /> Biblioteca <span className="nav-count">{friendlyCount(enemies.length)}</span></a>
          <button type="button" className="nav-item" onClick={() => navigate("/inimigos/novo")}><Plus size={17} /> Novo inimigo</button>
        </nav>
        <div className="sidebar-note"><Sparkles size={16} /><p><strong>Feito para a mesa.</strong><br />Crie fichas com o ritmo da sua sessão.</p></div>
        <div className="sidebar-bottom"><span className="status-dot" /> Biblioteca local <span className="version">v0.1</span></div>
      </aside>

      <main className="main-content" id="biblioteca">
        <header className="topbar"><div className="breadcrumb"><span>Campanha</span><ChevronRight size={14} /><strong>Biblioteca de inimigos</strong></div><div className="top-actions"><button type="button" className="icon-button" aria-label="Importar JSON" title="Importar JSON" onClick={() => fileInput.current?.click()}><Upload size={17} /></button><button type="button" className="icon-button" aria-label="Exportar biblioteca" title="Exportar biblioteca" onClick={exportLibrary}><Download size={17} /></button><input ref={fileInput} type="file" accept="application/json" className="visually-hidden" onChange={event => { importLibrary(event.target.files?.[0]); event.currentTarget.value = ""; }} /></div></header>
        <section className="hero-row"><div><div className="eyebrow"><span className="eyebrow-line" /> ARQUIVO DE CAMPANHA</div><h1>Seus inimigos,<br /><em>prontos para a cena.</em></h1><p className="hero-copy">Uma biblioteca viva para criar, ajustar e consultar criaturas em D&D 5e e 2024.</p></div><Link href="/inimigos/novo" className="primary-button"><Plus size={18} /> Criar inimigo</Link></section>

        <section className="stats-row" aria-label="Resumo da biblioteca"><div className="stat-card"><span className="stat-label">Total na biblioteca</span><strong>{friendlyCount(enemies.length)}</strong><span className="stat-meta">inimigos guardados</span></div><div className="stat-card"><span className="stat-label">Versão mais usada</span><strong>{enemies.filter(enemy => enemy.ruleset === "2024").length >= enemies.filter(enemy => enemy.ruleset === "2014").length ? "2024" : "5e"}</strong><span className="stat-meta">regras ativas</span></div><div className="stat-card stat-accent"><span className="stat-label">Seu próximo passo</span><strong><Wand2 size={19} /> ajustar</strong><span className="stat-meta">um inimigo existente</span></div></section>

        <section className="toolbar-section"><div className="search-wrap"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por nome, conceito ou tipo..." aria-label="Buscar inimigos" /></div><button type="button" className={`filter-toggle ${showFilters ? "selected" : ""}`} onClick={() => setShowFilters(value => !value)}><Filter size={16} /> Filtros <span>{[ruleset !== "Todos", type !== "Todos", size !== "Todos", challenge !== "Todos"].filter(Boolean).length || ""}</span></button><div className="view-toggle"><button type="button" className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Visualização em grade"><Grid3X3 size={16} /></button><button type="button" className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="Visualização em lista"><List size={16} /></button></div></section>
        {showFilters && <section className="filter-panel"><label>Regras<select value={ruleset} onChange={event => setRuleset(event.target.value as typeof ruleset)}><option>Todos</option><option value="2014">5e (2014)</option><option value="2024">D&D 2024</option></select></label><label>Tipo<select value={type} onChange={event => setType(event.target.value)}><option>Todos</option>{types.map(item => <option key={item}>{item}</option>)}</select></label><label>Tamanho<select value={size} onChange={event => setSize(event.target.value)}><option>Todos</option>{sizes.map(item => <option key={item}>{item}</option>)}</select></label><label>ND<select value={challenge} onChange={event => setChallenge(event.target.value)}><option>Todos</option>{challenges.map(item => <option key={item}>{item}</option>)}</select></label><button type="button" className="clear-filter" onClick={() => { setRuleset("Todos"); setType("Todos"); setSize("Todos"); setChallenge("Todos"); }}>limpar filtros</button></section>}

        <div className="section-heading"><div><span className="eyebrow">CATÁLOGO ATUAL</span><h2>{query || ruleset !== "Todos" || type !== "Todos" || size !== "Todos" || challenge !== "Todos" ? `${filtered.length} resultados` : "Criaturas em destaque"}</h2></div><span className="result-count">{filtered.length} de {enemies.length}</span></div>
        {filtered.length ? <div className={`enemy-grid ${view === "list" ? "list-view" : ""}`}>{filtered.map(enemy => <article className="enemy-card" key={enemy.id}><div className="card-top"><span className={`provenance-badge ${provenanceTone[enemy.provenance]}`}>{enemy.provenance}</span><div className="card-menu"><button type="button" aria-label={`Duplicar ${enemy.name}`} title="Duplicar" onClick={() => duplicate(enemy)}><Copy size={15} /></button><button type="button" aria-label={`Remover ${enemy.name}`} title="Remover" onClick={() => remove(enemy)}><Trash2 size={15} /></button></div></div><Link href={`/inimigos/${enemy.id}`} className="card-main"><h3>{enemy.name}</h3><p>{enemy.concept}</p><div className="card-divider" /><div className="card-meta"><span><b>{enemy.challenge}</b> ND</span><span>{enemy.size} · {enemy.type}</span><span className="rules-chip">{enemy.ruleset === "2024" ? "2024" : "5e"}</span></div></Link><Link href={`/inimigos/${enemy.id}`} className="card-foot">Abrir ficha <ChevronRight size={15} /></Link></article>)}</div> : <div className="empty-state"><Search size={26} /><h3>Nenhum inimigo encontrado</h3><p>Tente outra busca ou limpe os filtros para voltar ao catálogo.</p></div>}
        <footer className="page-footer"><span><span className="status-dot" /> Dados salvos neste navegador</span><span>Base de referência: SRD 5.2.1 + conteúdo original</span></footer>
      </main>
    </div>
  );
}
