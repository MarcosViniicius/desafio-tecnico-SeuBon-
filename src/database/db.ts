import Database from 'better-sqlite3';

const db = new Database('database.db');

// * Criar tabelas funcionarios e tarefas
db.exec(`
  CREATE TABLE IF NOT EXISTS funcionarios (
    funcionario_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tarefas (
    tarefa_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nomeTarefa TEXT NOT NULL,
    descricaoTarefa TEXT NOT NULL,
    prazoTarefa TEXT NOT NULL,
    prioridadeTarefa INTEGER NOT NULL,
    funcionario_id INTEGER,
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(funcionario_id) ON DELETE SET NULL
  );
`);

export default db;
