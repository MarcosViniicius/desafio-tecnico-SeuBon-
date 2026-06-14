import db from './db.js';
import type { Funcionario, Tarefa } from './types.js';

// * Criar funcionário
export function criarFuncionario(nome: string, email: string): void {
  const stmt = db.prepare('INSERT OR IGNORE INTO funcionarios (nome, email) VALUES (?, ?)');
  stmt.run(nome, email);
}

// * Editar funcionário
export function editarFuncionario(id: number, nome: string, email: string): void {
    const stmt = db.prepare('UPDATE funcionarios SET nome = ?, email = ? WHERE funcionario_id = ?');
    stmt.run(nome, email, id);
}

// * Atualizar status do funcionário (ativo/inativo)
export function atualizarStatusFuncionario(id: number, status: string): void {
    const stmt = db.prepare('UPDATE funcionarios SET status = ? WHERE funcionario_id = ?'); // status: 'ativo' ou 'inativo'
    stmt.run(status, id);
}

// * Listar todos os funcionários
export function listarFuncionarios(): Funcionario[] {
  const stmt = db.prepare('SELECT * FROM funcionarios');
  return stmt.all() as Funcionario[];
}

// * Buscar funcionário por ID
export function buscarFuncionarioPorId(id: number): Funcionario | undefined {
  const stmt = db.prepare('SELECT * FROM funcionarios WHERE funcionario_id = ?');
  return stmt.get(id) as Funcionario | undefined;
}

// * Listar tarefas por funcionário
export function listarTarefasPorFuncionario(funcionario_id: number): Tarefa[] {
    const stmt = db.prepare('SELECT * FROM tarefas WHERE funcionario_id = ?');
    return stmt.all(funcionario_id) as Tarefa[];
    
}

// * Carga de trabalho (número de tarefas atribuídas)
export function listarCargaFuncionario(funcionario_id: number): number {
    const stmt = db.prepare('SELECT COUNT(*) AS total FROM tarefas WHERE funcionario_id = ?');
    const result = stmt.get(funcionario_id) as { total: number };
    return result.total;
}

// * Tarefas vencidas
export function tarefasVencidasFuncionario(funcionario_id: number): Tarefa[] {
    const stmt = db.prepare("SELECT * FROM tarefas WHERE funcionario_id = ? AND prazoTarefa < date('now')");
    return stmt.all(funcionario_id) as Tarefa[];
}

// * Tarefas que vencem hoje
export function tarefasQueVencemHojeFuncionario(funcionario_id: number): Tarefa[] {
    const stmt = db.prepare("SELECT * FROM tarefas WHERE funcionario_id = ? AND prazoTarefa = date('now')");
    return stmt.all(funcionario_id) as Tarefa[];
}

// * Deletar funcionário
export function deletarFuncionario(id: number): void {
    const stmt = db.prepare('DELETE FROM funcionarios WHERE funcionario_id = ?');
    stmt.run(id);
}

