import { parseSSEChunk } from '../../src/hooks/useGenerationStream';

describe('parseSSEChunk', () => {
  test('parses a single JSON data event and returns remainder', () => {
    const buf = 'event: data\n data: {"msg":"hello"}\n\npartial-start';
    const events: Array<{ type: string; data: any }> = [];
    const rem = parseSSEChunk(buf, (type, data) => events.push({ type, data }));

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('data');
    expect(events[0].data).toEqual({ msg: 'hello' });
    expect(rem).toBe('partial-start');
  });

  test('parses multiple events in one buffer', () => {
    const buf = 'event: validation\n data: {"ok":true}\n\nevent: progress\n data: 42\n\n';
    const events: Array<{ type: string; data: any }> = [];
    const rem = parseSSEChunk(buf, (type, data) => events.push({ type, data }));

    expect(rem).toBe('');
    expect(events).toHaveLength(2);
    expect(events[0]).toEqual({ type: 'validation', data: { ok: true } });
    expect(events[1]).toEqual({ type: 'progress', data: 42 });
  });
});
