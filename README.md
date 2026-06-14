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

## Arquitetura: Simples e Direto

```
┌────────────────────────────────┐
│   HTML + JavaScript (browser)  │
│   fetch('/api/funcionarios')   │
│   fetch('/api/tarefas')        │
└──────────────┬─────────────────┘
               │
       ┌───────▼────────────────┐
       │  API Simples           │
       │  /api/funcionarios     │
       │  /api/tarefas          │
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
    funcionarios.ts    # CRUD de funcionários
    tarefas.ts         # CRUD de tarefas
  api.ts               # API endpoints (JSON)
  index.ts             # Servidor HTTP
public/
  index.html           # Frontend com JavaScript
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

## API Endpoints

Endpoints simples que retornam JSON:

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/funcionarios` | Lista todos os funcionários |
| POST | `/api/funcionarios` | Cria novo funcionário |
| GET | `/api/tarefas` | Lista todas as tarefas |
| POST | `/api/tarefas` | Cria nova tarefa |

### Exemplo de requisição:

```bash
# Listar funcionários
curl http://localhost:3000/api/funcionarios

# Criar funcionário
curl -X POST http://localhost:3000/api/funcionarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@email.com"}'

# Listar tarefas
curl http://localhost:3000/api/tarefas

# Criar tarefa
curl -X POST http://localhost:3000/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{"nomeTarefa":"Tarefa 1","descricaoTarefa":"Desc","prazoTarefa":"2025-12-31","prioridadeTarefa":2}'
```

## Frontend

O `public/index.html` contém:
- Formulários para criar funcionários e tarefas
- Tabelas que listam dados do banco
- JavaScript simples que usa `fetch()` para chamar a API
- Atualização em tempo real (sem reload)

## Funcionalidades Atuais

- ✅ CRUD de funcionários (criar, listar)
- ✅ CRUD de tarefas (criar, listar)
- ✅ API JSON minimalista
- ✅ Frontend com JavaScript simples
- ✅ TypeScript no servidor
- ✅ Sem frameworks complexos

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

- Dashboard visual e gráficos
- Relatórios analíticos (diário/semanal/mensal)
- Autenticação de usuários
- Seção "Riscos da Semana"
- UI estilizada e responsiva (apenas design básico)
- Múltiplas atribuições por tarefa
- Edição e exclusão completas de registros
- Filtros avançados e buscas

## O que faria com mais tempo

1. **Dashboard Gerencial** — cards com os 5 KPIs em tempo real
2. **Relatórios Analíticos** — gráficos de dados por período (dia/semana/mês)
3. **Seção "Riscos da Semana"** — alertas de tarefas atrasadas e sobrecarga
4. **UI Profissional** — CSS bem estruturado, design responsivo
5. **Múltiplas atribuições** — uma tarefa com vários responsáveis
6. **Autenticação** — apenas Ricardo pode editar tarefas
7. **Histórico de mudanças** — rastrear status das tarefas
8. **Notificações** — alertar colaboradores de novas tarefas
9. **Edição completa** — permitir editar e excluir tarefas e funcionários
10. **Status de tarefas** — marcar tarefas como "concluída", "em andamento", etc

## Scripts

- `npm run dev`: Executa em modo desenvolvimento com recompilação automática
- `npm run build`: Compila TypeScript para `dist/`
- `npm start`: Executa versão compilada
