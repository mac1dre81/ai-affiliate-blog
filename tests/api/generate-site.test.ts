import { generateSiteStream } from '../../src/app/api/generate-site/generateSiteStream';

// Mock the AI router to yield a few chunks
jest.mock('../../src/ai/router', () => ({
  generateStream: async (req: any) => {
    async function* stream() {
      yield { type: 'text', content: '<h1>Hello</h1>' };
      yield { type: 'text', content: '<p>Content</p>' };
      yield { type: 'text', content: '<!-- COMPLETE -->', done: true };
    }
    return stream();
  },
}));

// Mock ContentSafetyLayer to return a predictable validation result
jest.mock('../../src/validation/ContentSafetyLayer', () => {
  return jest.fn().mockImplementation(() => ({
    validateGeneration: async (html: string) => ({ ok: true, issues: [] }),
  }));
});

describe('generateSiteStream', () => {
  test('streams SSE events and emits validation and done events', async () => {
    const stream = await generateSiteStream({ description: 'test', userId: 'u1' });

    const reader = (stream as any).getReader();
    let chunks: string[] = [];
    // read all
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const res = await reader.read();
      if (res.done) break;
      const text = new TextDecoder().decode(res.value);
      chunks.push(text);
    }

    const all = chunks.join('\n');
    expect(all).toContain('Hello');
    expect(all).toContain('validation');
    expect(all).toContain('done');
  });
});
