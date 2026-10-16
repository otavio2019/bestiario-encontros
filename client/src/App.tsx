import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import EnemyEditor from "./pages/EnemyEditor";
import EnemyView from "./pages/EnemyView";
import EncounterBuilder from "./pages/EncounterBuilder";

function NotFound() {
  return <div className="not-found"><a className="back-link" href="/">Voltar para a biblioteca</a><h1>Página não encontrada</h1><p>O caminho informado não existe.</p></div>;
}

export default function App() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/inimigos/novo" component={EnemyEditor} />
    <Route path="/encontros" component={EncounterBuilder} />
    <Route path="/inimigos/:id/editar" component={EnemyEditor} />
    <Route path="/inimigos/:id" component={EnemyView} />
    <Route component={NotFound} />
  </Switch>;
}
