import { createServer } from 'https';
import { parse } from 'url';
import next from 'next';
import { loadEnv } from '../env.utils';

async function startServer() {
  const env = await loadEnv();
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev });
  const handle = app.getRequestHandler();
  
  await app.prepare();
  
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log(`> Server running at http://localhost:3000`);
    console.log(`> Environment: ${process.env.NODE_ENV}`);
    console.log(`> Module system: ${process.env.MODULE_SYSTEM || 'ESM'}`); 
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});