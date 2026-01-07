const fetch = require('node-fetch');

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function check(path, method = 'GET', body) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    console.log(`${method} ${url} -> ${res.status}`);
    const text = await res.text();
    // print limited body for debugging
    console.log(text.slice(0, 400));
  } catch (err) {
    console.error(`${method} ${url} -> ERROR`, err.message);
    process.exitCode = 2;
  }
}

(async function run() {
  await check('/');
  await check('/api/posts');
  // POST to AI generate: if you don't have a key, this may fail — use staging or mock
  await check('/api/ai/generate', 'POST', { prompt: 'Hello world test' });
})();
