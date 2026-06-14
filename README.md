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

### 1. **Taxa de Conclusão (%)**
- **O que mostra**: Percentual de tarefas concluídas em relação ao total
- **Decisão**: Ricardo vê se o time está entregando. Exemplo: 33% significa que 1 de cada 3 tarefas foi concluída, o que ajuda a avaliar o ritmo de trabalho

### 2. **Tarefas Atrasadas**
- **O que mostra**: Quantas tarefas perderam o prazo (prazo < hoje)
- **Decisão**: Ricardo identifica quantas tarefas estão atrasadas e precisa agir. Exemplo: 1 tarefa atrasada exige ação imediata do time

## O que foi cortado para o prazo

- **Dashboard com gráficos visuais** — Os KPIs aparecem em cards simples, mas não há gráficos (pizza, barras, etc)
- **Mais KPIs** — Escolhemos os 2 mais críticos (taxa de conclusão e atrasadas), mas não implementamos distribuição de carga, tempo médio, etc
- **Relatórios analíticos** — Sem relatórios por período, apenas visualização atual dos dados
- **Autenticação** — Sem login, qualquer pessoa acessa (OK para MVP, mas falta segurança)
- **Histórico completo** — Não rastreia quando tarefas mudam de status
- **Notificações proativas** — Sem alertas automáticos quando tarefas ficam atrasadas
- **UI responsiva** — Funciona, mas design é básico e não é otimizado para mobile

## O que faria com mais tempo

1. **Dashboard com gráficos interativos** — Gráfico de pizza mostrando distribuição de tarefas por status, gráfico de barras com carga por funcionário
2. **Mais KPIs acionáveis** — Adicionar "Distribuição de carga" (quantas tarefas cada um tem), "Tempo médio de conclusão", "Taxa de cumprimento de prazo"
3. **Alertas automáticos** — Notificar quando uma tarefa fica atrasada ou quando alguém fica com sobrecarga
4. **Autenticação e permissões** — Login para Ricardo, visibilidade restrita do time, apenas Ricardo vê números sensíveis
5. **Histórico de mudanças** — Ver quando/quem mudou status, responsável, prazo
6. **Relatórios em PDF/Excel** — Exportar KPIs e listas de tarefas para compartilhar
7. **UI responsiva e design profissional** — Mobile-friendly, tema customizável
8. **Status granular de tarefas** — Não só "concluído/não-concluído", mas "Backlog → Em andamento → Review → Pronto → Concluído"
9. **Múltiplas atribuições** — Uma tarefa pode ter vários responsáveis com diferentes papéis
10. **Integração com calendário** — Visualizar tarefas em calendário, detectar gargalos visuais

## Scripts

- `npm run dev`: Executa em modo desenvolvimento (tsx)
- `npm run build`: Compila TypeScript para `dist/`
- `npm start`: Executa versão compilada
