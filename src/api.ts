import { IncomingMessage, ServerResponse } from 'node:http';
import {
  listarFuncionarios,
  buscarFuncionarioPorId,
  criarFuncionario,
  editarFuncionario,
  atualizarStatusFuncionario,
  listarTarefasPorFuncionario,
  listarCargaFuncionario,
  tarefasVencidasFuncionario,
  tarefasQueVencemHojeFuncionario,
  deletarFuncionario,
} from './database/funcionarios.js';
import {
  listarTarefas,
  buscarTarefaPorId,
  criarTarefa,
  editarTarefa,
  deletarTarefa,
  atribuirResponsavel,
  listarTarefasEmAndamento,
  listarTarefasConcluidas,
  listarTarefasAtrasadas,
  listarTarefasProximasVencimento,
} from './database/tarefas.js';

type Handler = (body: string, params: Record<string, string>) => { status: number; data: unknown };

const routes: Record<string, Handler> = {
  // Funcionários
  'GET /api/funcionarios': () => ({
    status: 200,
    data: listarFuncionarios(),
  }),

  'POST /api/funcionarios': (body) => {
    const { nome, email } = JSON.parse(body);
    criarFuncionario(nome, email);
    return { status: 201, data: { success: true } };
  },

  'GET /api/funcionarios/:id': (_, params) => {
    const funcionario = buscarFuncionarioPorId(parseInt(params.id || '', 10));
    if (!funcionario) return { status: 404, data: { error: 'Funcionário não encontrado' } };
    return { status: 200, data: funcionario };
  },

  'PUT /api/funcionarios/:id': (body, params) => {
    const { nome, email } = JSON.parse(body);
    editarFuncionario(parseInt(params.id || '', 10), nome, email);
    return { status: 200, data: { success: true } };
  },

  'DELETE /api/funcionarios/:id': (_, params) => {
    deletarFuncionario(parseInt(params.id || '', 10));
    return { status: 200, data: { success: true } };
  },

  'PATCH /api/funcionarios/:id/status': (body, params) => {
    const { status: statusValue } = JSON.parse(body);
    atualizarStatusFuncionario(parseInt(params.id || '', 10), statusValue);
    return { status: 200, data: { success: true } };
  },

  'GET /api/funcionarios/:id/tarefas': (_, params) => {
    const tarefas = listarTarefasPorFuncionario(parseInt(params.id || '', 10));
    return { status: 200, data: tarefas };
  },

  'GET /api/funcionarios/:id/carga': (_, params) => {
    const carga = listarCargaFuncionario(parseInt(params.id || '', 10));
    return { status: 200, data: { carga } };
  },

  'GET /api/funcionarios/:id/tarefas/vencidas': (_, params) => {
    const tarefas = tarefasVencidasFuncionario(parseInt(params.id || '', 10));
    return { status: 200, data: tarefas };
  },

  'GET /api/funcionarios/:id/tarefas/hoje': (_, params) => {
    const tarefas = tarefasQueVencemHojeFuncionario(parseInt(params.id || '', 10));
    return { status: 200, data: tarefas };
  },

  // Tarefas
  'GET /api/tarefas': () => ({
    status: 200,
    data: listarTarefas(),
  }),

  'POST /api/tarefas': (body) => {
    const { nomeTarefa, descricaoTarefa, prazoTarefa, prioridadeTarefa, funcionario_id } = JSON.parse(body);
    criarTarefa(nomeTarefa, descricaoTarefa, prazoTarefa, prioridadeTarefa, funcionario_id || null);
    return { status: 201, data: { success: true } };
  },

  'GET /api/tarefas/:id': (_, params) => {
    const tarefa = buscarTarefaPorId(parseInt(params.id || '', 10));
    if (!tarefa) return { status: 404, data: { error: 'Tarefa não encontrada' } };
    return { status: 200, data: tarefa };
  },

  'PUT /api/tarefas/:id': (body, params) => {
    const { nomeTarefa, descricaoTarefa, prazoTarefa, prioridadeTarefa, funcionario_id } = JSON.parse(body);
    editarTarefa(parseInt(params.id || '', 10), nomeTarefa, descricaoTarefa, prazoTarefa, prioridadeTarefa, funcionario_id || null);
    return { status: 200, data: { success: true } };
  },

  'DELETE /api/tarefas/:id': (_, params) => {
    deletarTarefa(parseInt(params.id || '', 10));
    return { status: 200, data: { success: true } };
  },

  'PATCH /api/tarefas/:id/responsavel': (body, params) => {
    const { funcionario_id } = JSON.parse(body);
    atribuirResponsavel(parseInt(params.id || '', 10), funcionario_id || null);
    return { status: 200, data: { success: true } };
  },

  'GET /api/tarefas/em-andamento': () => ({
    status: 200,
    data: listarTarefasEmAndamento(),
  }),

  'GET /api/tarefas/concluidas': () => ({
    status: 200,
    data: listarTarefasConcluidas(),
  }),

  'GET /api/tarefas/atrasadas': () => ({
    status: 200,
    data: listarTarefasAtrasadas(),
  }),

  'GET /api/tarefas/proximas': () => ({
    status: 200,
    data: listarTarefasProximasVencimento(),
  }),
};

function parseRoute(pathname: string): { route: string; params: Record<string, string> } {
  const segments = pathname.split('/').filter(Boolean);
  const params: Record<string, string> = {};

  for (const route of Object.keys(routes)) {
    const pathPart = route.split(' ')[1];
    if (!pathPart) continue;

    const routeSegments = pathPart.split('/').filter(Boolean);

    if (routeSegments.length !== segments.length) continue;

    let match = true;
    for (let i = 0; i < routeSegments.length; i++) {
      const routeSeg = routeSegments[i];
      if (routeSeg?.startsWith(':')) {
        params[routeSeg.slice(1)] = segments[i] || '';
      } else if (routeSeg !== segments[i]) {
        match = false;
        break;
      }
    }

    if (match) return { route: pathPart, params };
  }

  return { route: '', params: {} };
}

export async function handleApi(
  request: IncomingMessage,
  response: ServerResponse,
  pathname: string,
  body: string
): Promise<boolean> {
  if (!pathname.startsWith('/api/')) return false;

  const { route, params } = parseRoute(pathname);
  const routeKey = `${request.method} ${route}`;
  const handler = routes[routeKey];

  if (!handler) return false;

  response.setHeader('Content-Type', 'application/json');

  try {
    const { status, data } = handler(body, params);
    response.writeHead(status);
    response.end(JSON.stringify(data));
  } catch (error) {
    response.writeHead(400);
    response.end(JSON.stringify({ error: 'Dados inválidos' }));
  }

  return true;
}
