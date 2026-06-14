# Gestão de Atividades

Ferramenta simples para gerenciar tarefas e funcionários de um time usando TypeScript, Node.js e SQLite.

## Problema que resolve

Ricardo é dono de uma empresa com 10 pessoas e enfrenta estes desafios:
- Trabalho espalhado em planilha, papel e WhatsApp — sem visão clara do que está acontecendo
- Não sabe se o time está sobrecarregado ou ocioso até alguém reclamar
- Prazos estouram sem aviso prévio
- Reuniões sem dados reais — apenas impressões

## Metodologia: Kanban

Implementamos Kanban porque:
- **Visualiza claramente** o fluxo de trabalho
- **Identifica gargalos** rapidamente
- **Funciona bem** para times pequenos (10 pessoas)
- **Status claros**: A Fazer, Em Andamento, Concluído, Atrasado

## Arquitetura: API Completa + Frontend

```
┌────────────────────────────────┐
│   HTML + JavaScript (browser)  │
│   fetch('/api/funcionarios')   │
│   fetch('/api/tarefas')        │
└──────────────┬─────────────────┘
               │
       ┌───────▼────────────────┐
       │  25 API Endpoints      │
       │  (CRUD + Queries)      │
       └───────┬────────────────┘
               │
       ┌───────▼────────────────┐
       │  TypeScript (Node.js)  │
       │  Executa funções do    │
       │  database/             │
       └───────┬────────────────┘
               │
        ┌──────▼───────┐
        │  SQLite      │
        │  database.db │
        └──────────────┘
```

## Estrutura do Projeto

```text
src/
  database/
    db.ts              # Inicializa SQLite
    types.ts           # Interfaces TypeScript
    funcionarios.ts    # CRUD e queries de funcionários
    tarefas.ts         # CRUD e queries de tarefas
  api.ts               # API com 25 endpoints
  index.ts             # Servidor HTTP
public/
  index.html           # Frontend com forms e tabelas
  style.css            # Estilos
dist/                  # Saída compilada
database.db            # Banco SQLite
```

## Como rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Compilar TypeScript
```bash
npm run build
```

### 3. Rodar o servidor
```bash
npm start
```

Acesse **http://localhost:3000** no navegador.

### 4. Ou rodar em desenvolvimento
```bash
npm run dev
```

## API Endpoints (25 total)

### Funcionários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/funcionarios` | Listar todos |
| POST | `/api/funcionarios` | Criar novo |
| GET | `/api/funcionarios/:id` | Detalhes de um |
| PUT | `/api/funcionarios/:id` | Editar |
| PATCH | `/api/funcionarios/:id/status` | Atualizar status (ativo/inativo) |
| GET | `/api/funcionarios/:id/tarefas` | Tarefas do funcionário |
| GET | `/api/funcionarios/:id/carga` | Quantidade de tarefas atribuídas |
| GET | `/api/funcionarios/:id/tarefas/vencidas` | Tarefas com prazo expirado |
| GET | `/api/funcionarios/:id/tarefas/hoje` | Tarefas vencendo hoje |

### Tarefas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/tarefas` | Listar todas |
| POST | `/api/tarefas` | Criar nova |
| GET | `/api/tarefas/:id` | Detalhes de uma |
| PUT | `/api/tarefas/:id` | Editar |
| DELETE | `/api/tarefas/:id` | Deletar |
| PATCH | `/api/tarefas/:id/responsavel` | Atribuir funcionário |
| GET | `/api/tarefas/em-andamento` | Tarefas com prazo no futuro |
| GET | `/api/tarefas/concluidas` | Tarefas com prazo expirado |
| GET | `/api/tarefas/atrasadas` | Tarefas atrasadas |
| GET | `/api/tarefas/proximas` | Próximas 3 dias |

### Exemplo de uso

```bash
# Listar funcionários
curl http://localhost:3000/api/funcionarios

# Criar funcionário
curl -X POST http://localhost:3000/api/funcionarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@email.com"}'

# Listar tarefas
curl http://localhost:3000/api/tarefas

# Criar tarefa
curl -X POST http://localhost:3000/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{"nomeTarefa":"Implementar feature X","descricaoTarefa":"Descrição","prazoTarefa":"2025-12-31","prioridadeTarefa":2}'
```

## Frontend

O `public/index.html` contém:
- Formulários para criar funcionários e tarefas
- Tabelas que listam dados em tempo real
- JavaScript simples que usa `fetch()` para chamar a API
- Atualização automática após criar registros
- Estilos básicos em `style.css`

## Funcionalidades Atuais

- ✅ CRUD completo de funcionários e tarefas
- ✅ 25 endpoints de API bem estruturados
- ✅ Queries de status e análise de tarefas
- ✅ Frontend interativo com atualização em tempo real
- ✅ TypeScript com tipos definidos
- ✅ Sem frameworks complexos (Node.js nativo)

## KPIs (Indicadores)

Cada KPI responde a uma decisão que Ricardo precisa tomar:

### 1. **Tarefas atrasadas**
- **O que mostra**: Quantas tarefas perderam o prazo
- **Decisão**: Ricardo identifica gargalos e prioriza ações corretivas

### 2. **Entregas na semana**
- **O que mostra**: Volume de tarefas concluídas recentemente
- **Decisão**: Avaliar produtividade do time e ritmo de entrega

### 3. **Taxa de cumprimento de prazo**
- **O que mostra**: Percentual de tarefas concluídas dentro do prazo
- **Decisão**: Avaliar confiabilidade das entregas para clientes

### 4. **Distribuição de carga**
- **O que mostra**: Quantas tarefas cada funcionário tem atribuído
- **Decisão**: Redistribuir trabalho e evitar sobrecarga

### 5. **Tempo médio de conclusão**
- **O que mostra**: Quanto tempo leva para completar uma tarefa
- **Decisão**: Identificar processos lentos e oportunidades de melhoria

## O que foi cortado para o prazo

- Dashboard visual com gráficos
- Relatórios analíticos (diário/semanal/mensal)
- Autenticação de usuários
- Seção "Riscos da Semana"
- UI responsiva e design avançado
- Múltiplas atribuições por tarefa
- Histórico de mudanças de status
- Notificações

## O que faria com mais tempo

1. **Dashboard Gerencial** — cards com os 5 KPIs em tempo real
2. **Relatórios Analíticos** — gráficos de dados por período
3. **Seção "Riscos da Semana"** — alertas automáticos
4. **UI Profissional** — design responsivo e polido
5. **Múltiplas atribuições** — uma tarefa com vários responsáveis
6. **Autenticação** — apenas Ricardo pode editar
7. **Histórico** — rastrear mudanças de status
8. **Notificações** — alertar colaboradores
9. **Export** — gerar relatórios em PDF/Excel
10. **Filtros avançados** — buscar por status, prioridade, etc

## Scripts

- `npm run dev`: Executa em modo desenvolvimento (tsx)
- `npm run build`: Compila TypeScript para `dist/`
- `npm start`: Executa versão compilada
