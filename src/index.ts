import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApi } from './api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const distDir = path.join(projectRoot, 'dist');
const port = Number(process.env.PORT ?? 3000);

function getContentType(filePath: string): string {
  const extension = path.extname(filePath);
  if (extension === '.html') return 'text/html; charset=utf-8';
  if (extension === '.js') return 'text/javascript; charset=utf-8';
  if (extension === '.css') return 'text/css; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

function resolvePublicPath(url = '/'): string | null {
  const requestedPath = url === '/' ? '/index.html' : decodeURIComponent(url);
  const isDistFile = requestedPath.startsWith('/dist/');
  const baseDir = isDistFile ? distDir : publicDir;
  const relativePath = isDistFile ? requestedPath.replace('/dist/', '') : requestedPath;
  const filePath = path.normalize(path.join(baseDir, relativePath));

  if (!filePath.startsWith(baseDir)) {
    return null;
  }

  return filePath;
}

async function getRequestBody(request: any): Promise<string> {
  return new Promise((resolve) => {
    let body = '';
    request.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    request.on('end', () => {
      resolve(body);
    });
  });
}

const server = createServer(async (request, response) => {
  const url = new URL(`http://localhost${request.url}`);
  const pathname = url.pathname;
  const body = await getRequestBody(request);

  // Handle API
  if (await handleApi(request, response, pathname, body)) {
    return;
  }

  // Serve static files
  const filePath = resolvePublicPath(request.url);
  if (!filePath) {
    response.writeHead(403);
    response.end('Acesso negado');
    return;
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': getContentType(filePath) });
    response.end(file);
  } catch {
    response.writeHead(404);
    response.end('Arquivo não encontrado');
  }
});

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
