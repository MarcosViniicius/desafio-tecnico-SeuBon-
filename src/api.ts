import { IncomingMessage, ServerResponse } from 'node:http';
import { listarFuncionarios, criarFuncionario } from './database/funcionarios.js';
import { listarTarefas, criarTarefa } from './database/tarefas.js';

export async function handleApi(
  request: IncomingMessage,
  response: ServerResponse,
  pathname: string,
  body: string
): Promise<boolean> {
  if (!pathname.startsWith('/api/')) {
    return false;
  }

  response.setHeader('Content-Type', 'application/json');

  // GET /api/funcionarios
  if (pathname === '/api/funcionarios' && request.method === 'GET') {
    const funcionarios = listarFuncionarios();
    response.writeHead(200);
    response.end(JSON.stringify(funcionarios));
    return true;
  }

  // POST /api/funcionarios
  if (pathname === '/api/funcionarios' && request.method === 'POST') {
    try {
      const data = JSON.parse(body);
      criarFuncionario(data.nome, data.email);
      response.writeHead(201);
      response.end(JSON.stringify({ success: true }));
    } catch (error) {
      response.writeHead(400);
      response.end(JSON.stringify({ error: 'Dados inválidos' }));
    }
    return true;
  }

  // GET /api/tarefas
  if (pathname === '/api/tarefas' && request.method === 'GET') {
    const tarefas = listarTarefas();
    response.writeHead(200);
    response.end(JSON.stringify(tarefas));
    return true;
  }

  // POST /api/tarefas
  if (pathname === '/api/tarefas' && request.method === 'POST') {
    try {
      const data = JSON.parse(body);
      criarTarefa(data.nomeTarefa, data.descricaoTarefa, data.prazoTarefa, data.prioridadeTarefa, null);
      response.writeHead(201);
      response.end(JSON.stringify({ success: true }));
    } catch (error) {
      response.writeHead(400);
      response.end(JSON.stringify({ error: 'Dados inválidos' }));
    }
    return true;
  }

  return false;
}
