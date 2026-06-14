import db from './db.js';
import type { Funcionario, Tarefa } from './types.js';


export function criarFuncionario(nome: string, email: string): void {
  const stmt = db.prepare('INSERT OR IGNORE INTO funcionarios (nome, email) VALUES (?, ?)');
  stmt.run(nome, email);
}

export function editarFuncionario(id: number, nome: string, email: string): void {
    const stmt = db.prepare('UPDATE funcionarios SET nome = ?, email = ? WHERE funcionario_id = ?');
    stmt.run(nome, email, id);
}

export function atualizarStatusFuncionario(id: number, status: string): void {
    const stmt = db.prepare('UPDATE funcionarios SET status = ? WHERE funcionario_id = ?'); // status: 'ativo' ou 'inativo'
    stmt.run(status, id);
}

export function listarFuncionarios(): Funcionario[] {
  const stmt = db.prepare('SELECT * FROM funcionarios');
  return stmt.all() as Funcionario[];
}

export function buscarFuncionarioPorId(id: number): Funcionario | undefined {
  const stmt = db.prepare('SELECT * FROM funcionarios WHERE funcionario_id = ?');
  return stmt.get(id) as Funcionario | undefined;
}

export function listarTarefasPorFuncionario(funcionario_id: number): Tarefa[] {
    const stmt = db.prepare('SELECT * FROM tarefas WHERE funcionario_id = ?');
    return stmt.all(funcionario_id) as Tarefa[];
    
}

export function listarCargaFuncionario(funcionario_id: number): number {
    const stmt = db.prepare('SELECT COUNT(*) AS total FROM tarefas WHERE funcionario_id = ?');
    const result = stmt.get(funcionario_id) as { total: number };
    return result.total;
}

export function tarefasVencidasFuncionario(funcionario_id: number): Tarefa[] {
    const stmt = db.prepare('SELECT * FROM tarefas WHERE funcionario_id = ? AND prazoTarefa < date("now")');
    return stmt.all(funcionario_id) as Tarefa[];
}

export function tarefasQueVencemHojeFuncionario(funcionario_id: number): Tarefa[] {
    const stmt = db.prepare('SELECT * FROM tarefas WHERE funcionario_id = ? AND prazoTarefa = date("now")');
    return stmt.all(funcionario_id) as Tarefa[];
}

export function tarefasVencemEm3DiasFuncionario(funcionario_id: number): Tarefa[] {
    const stmt = db.prepare('SELECT * FROM tarefas WHERE funcionario_id = ? AND prazoTarefa > date("now") AND prazoTarefa <= date("now", "+3 days")');
    return stmt.all(funcionario_id) as Tarefa[];
}

