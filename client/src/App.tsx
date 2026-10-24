import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import EnemyEditor from "./pages/EnemyEditor";
import EnemyView from "./pages/EnemyView";
import EncounterBuilder from "./pages/EncounterBuilder";
import Combat from "./pages/Combat";

function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("bestiario-theme") === "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("bestiario-theme", dark ? "dark" : "light");
  }, [dark]);
  return <button type="button" className="dark-mode-toggle" onClick={() => setDark(value => !value)} aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"} title={dark ? "Modo claro" : "Modo escuro"}>{dark ? <Sun size={17} /> : <Moon size={17} />}<span>{dark ? "Luz" : "Trevas"}</span></button>;
}

function NotFound() {
  return <div className="not-found"><a className="back-link" href="/">Voltar para a biblioteca</a><h1>Página não encontrada</h1><p>O caminho informado não existe.</p></div>;
}

export default function App() {
  return <><ThemeToggle /><Switch>
    <Route path="/" component={Home} />
    <Route path="/inimigos/novo" component={EnemyEditor} />
    <Route path="/encontros" component={EncounterBuilder} />
    <Route path="/combate" component={Combat} />
    <Route path="/inimigos/:id/editar" component={EnemyEditor} />
    <Route path="/inimigos/:id" component={EnemyView} />
    <Route component={NotFound} />
  </Switch></>;
}
