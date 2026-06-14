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
    status TEXT DEFAULT 'pendente',
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(funcionario_id) ON DELETE SET NULL
  );
`);

try {
  db.exec("ALTER TABLE tarefas ADD COLUMN status TEXT DEFAULT 'pendente'");
} catch {
  // coluna já existe
}

const { count } = db.prepare('SELECT COUNT(*) as count FROM funcionarios').get() as { count: number };

if (count === 0) {
  db.exec(`
    INSERT INTO funcionarios (nome, email) VALUES
      ('Ana Lima',       'ana@empresa.com'),
      ('Bruno Carvalho', 'bruno@empresa.com'),
      ('Carla Souza',    'carla@empresa.com'),
      ('Diego Martins',  'diego@empresa.com');

    INSERT INTO tarefas (nomeTarefa, descricaoTarefa, prazoTarefa, prioridadeTarefa, funcionario_id, status) VALUES
      ('Redesign do site',            'Atualizar identidade visual e UX do site institucional',         date('now', '+10 days'), 3, 1, 'pendente'),
      ('Relatório mensal',            'Consolidar dados de vendas do mês anterior',                     date('now', '-5 days'),  2, 2, 'concluida'),
      ('Integração com CRM',          'Conectar sistema interno ao Salesforce via API REST',            date('now', '+2 days'),  4, 3, 'pendente'),
      ('Onboarding novo colaborador', 'Apresentar processos e ferramentas ao Marcos',                   date('now', '-3 days'),  1, 4, 'pendente'),
      ('Auditoria de segurança',      'Revisar permissões e acessos no servidor de produção',           date('now', '-8 days'),  4, 1, 'pendente'),
      ('Campanha de email marketing', 'Criar e disparar campanha para base de clientes ativos',         date('now', '+20 days'), 2, 2, 'pendente'),
      ('Atualização de dependências', 'Subir versão de libs com vulnerabilidades conhecidas',           date('now', '+7 days'),  3, 3, 'concluida'),
      ('Pesquisa de satisfação',      'Enviar NPS para clientes da última safra de contratos',          date('now', '+1 days'),  2, 4, 'pendente');
  `);
}

export default db;
