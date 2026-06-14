import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApi } from './api.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(projectRoot, 'public');
const distDir = path.join(projectRoot, 'dist');
const port = Number(process.env.PORT ?? 3000);

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
};

function resolvePublicPath(url = '/'): string | null {
  const requestedPath = url === '/' ? '/index.html' : decodeURIComponent(url);
  const isDistFile = requestedPath.startsWith('/dist/');
  const baseDir = isDistFile ? distDir : publicDir;
  const relativePath = isDistFile ? requestedPath.slice('/dist/'.length) : requestedPath;
  const filePath = path.normalize(path.join(baseDir, relativePath));
  return filePath.startsWith(baseDir) ? filePath : null;
}

async function getRequestBody(request: any): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString();
}

const server = createServer(async (request, response) => {
  const pathname = new URL(`http://localhost${request.url}`).pathname;
  const body = await getRequestBody(request);

  if (await handleApi(request, response, pathname, body)) return;

  const filePath = resolvePublicPath(request.url);

  if (!filePath) {
    response.writeHead(403).end('Acesso negado');
    return;
  }

  try {
    const file = await readFile(filePath);
    const contentType = CONTENT_TYPES[path.extname(filePath)] ?? 'text/plain; charset=utf-8';
    response.writeHead(200, { 'Content-Type': contentType }).end(file);
  } catch {
    response.writeHead(404).end('Arquivo não encontrado');
  }
});

server.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
process.on('SIGINT', () => server.close(() => process.exit(0)));