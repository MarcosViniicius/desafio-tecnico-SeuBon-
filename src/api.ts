import { IncomingMessage, ServerResponse } from 'node:http';
import { listarFuncionarios, criarFuncionario } from './database/funcionarios.js';
import { listarTarefas, criarTarefa } from './database/tarefas.js';

type Handler = (body: string) => { status: number; data: unknown };

const routes: Record<string, Handler> = {
  'GET /api/funcionarios': () => ({
    status: 200,
    data: listarFuncionarios(),
  }),

  'POST /api/funcionarios': (body) => {
    const { nome, email } = JSON.parse(body);
    criarFuncionario(nome, email);
    return { status: 201, data: { success: true } };
  },

  'GET /api/tarefas': () => ({
    status: 200,
    data: listarTarefas(),
  }),

  'POST /api/tarefas': (body) => {
    const { nomeTarefa, descricaoTarefa, prazoTarefa, prioridadeTarefa } = JSON.parse(body);
    criarTarefa(nomeTarefa, descricaoTarefa, prazoTarefa, prioridadeTarefa, null);
    return { status: 201, data: { success: true } };
  },
};

export async function handleApi(
  request: IncomingMessage,
  response: ServerResponse,
  pathname: string,
  body: string
): Promise<boolean> {
  if (!pathname.startsWith('/api/')) return false;

  const handler = routes[`${request.method} ${pathname}`];
  if (!handler) return false;

  response.setHeader('Content-Type', 'application/json');

  try {
    const { status, data } = handler(body);
    response.writeHead(status);
    response.end(JSON.stringify(data));
  } catch {
    response.writeHead(400);
    response.end(JSON.stringify({ error: 'Dados inválidos' }));
  }

  return true;
}