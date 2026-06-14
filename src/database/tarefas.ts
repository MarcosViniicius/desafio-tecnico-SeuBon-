import db from './db.js';
import type { Tarefa } from './types.js';



export function criarTarefa(nomeTarefa: string, descricaoTarefa: string, prazoTarefa: string, prioridadeTarefa: number, funcionario_id: number | null): void {
  const stmt = db.prepare('INSERT OR IGNORE INTO tarefas (nomeTarefa, descricaoTarefa, prazoTarefa, prioridadeTarefa, funcionario_id) VALUES (?, ?, ?, ?, ?)');
  stmt.run(nomeTarefa, descricaoTarefa, prazoTarefa, prioridadeTarefa, funcionario_id);
}

export function editarTarefa(id: number, nomeTarefa: string, descricaoTarefa: string, prazoTarefa: string, prioridadeTarefa: number, funcionario_id: number | null): void {
    const stmt = db.prepare('UPDATE tarefas SET nomeTarefa = ?, descricaoTarefa = ?, prazoTarefa = ?, prioridadeTarefa = ?, funcionario_id = ? WHERE tarefa_id = ?');
    stmt.run(nomeTarefa, descricaoTarefa, prazoTarefa, prioridadeTarefa, funcionario_id, id);
}

export function deletarTarefa(id: number): void {
    const stmt = db.prepare('DELETE FROM tarefas WHERE tarefa_id = ?');
    stmt.run(id);
}

export function atribuirResponsavel(id: number, funcionario_id: number | null): void {
    const stmt = db.prepare('UPDATE tarefas SET funcionario_id = ? WHERE tarefa_id = ?');
    stmt.run(funcionario_id, id);
}

export function listarTarefasPorFuncionario(funcionario_id: number): Tarefa[] {
    const stmt = db.prepare('SELECT * FROM tarefas WHERE funcionario_id = ?');
    return stmt.all(funcionario_id) as Tarefa[];
}

export function listarTarefas(): Tarefa[] {
  const stmt = db.prepare('SELECT * FROM tarefas');
  return stmt.all() as Tarefa[];
}

export function buscarTarefaPorId(id: number): Tarefa | undefined {
  const stmt = db.prepare('SELECT * FROM tarefas WHERE tarefa_id = ?');
  return stmt.get(id) as Tarefa | undefined;
}

// * Total de tarefas
export function contarTarefas(): number {
    const stmt = db.prepare('SELECT COUNT(*) AS total FROM tarefas');
    const result = stmt.get() as { total: number };
    return result.total;
}
// * Tarefas em andamento
export function listarTarefasEmAndamento(): Tarefa[] {
    const stmt = db.prepare('SELECT * FROM tarefas WHERE prazoTarefa > date("now")');
    return stmt.all() as Tarefa[];
}
// * Tarefas concluídas
export function listarTarefasConcluidas(): Tarefa[] {
    const stmt = db.prepare('SELECT * FROM tarefas WHERE prazoTarefa <= date("now")');
    return stmt.all() as Tarefa[];
}
// * Tarefas atrasadas
export function listarTarefasAtrasadas(): Tarefa[] {
    const stmt = db.prepare('SELECT * FROM tarefas WHERE prazoTarefa < date("now") AND prioridadeTarefa < 3');
    return stmt.all() as Tarefa[];
}
// * Tarefas próximas do vencimento
export function listarTarefasProximasVencimento(): Tarefa[] {
    const stmt = db.prepare('SELECT * FROM tarefas WHERE prazoTarefa BETWEEN date("now") AND date("now", "+3 days")');
    return stmt.all() as Tarefa[];
}

