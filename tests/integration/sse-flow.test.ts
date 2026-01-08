// tests/integration/sse-flow.test.ts
// Integration tests for SSE client/server streaming flow

import { parseSSEChunk } from '@/hooks/useGenerationStream';

describe('SSE Integration Flow', () => {
  test('parseSSEChunk handles reserved event correctly', () => {
    const chunk = 'event: reserved\ndata: {"reserved":10}\n\n';
    const events: any[] = [];
    const remainder = parseSSEChunk(chunk, (type, data) => {
      events.push({ type, data });
    });

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('reserved');
    expect(events[0].data).toEqual({ reserved: 10 });
    expect(remainder).toBe('');
  });

  test('parseSSEChunk handles credits event', () => {
    const chunk = 'event: credits\ndata: {"remaining":90}\n\n';
    const events: any[] = [];
    parseSSEChunk(chunk, (type, data) => {
      events.push({ type, data });
    });

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('credits');
    expect(events[0].data.remaining).toBe(90);
  });

  test('parseSSEChunk handles multiple events in sequence', () => {
    const chunk = `event: reserved
data: {"reserved":10}

event: credits
data: {"remaining":90}

event: progress
data: 50

`;
    const events: any[] = [];
    parseSSEChunk(chunk, (type, data) => {
      events.push({ type, data });
    });

    expect(events).toHaveLength(3);
    expect(events[0].type).toBe('reserved');
    expect(events[1].type).toBe('credits');
    expect(events[2].type).toBe('progress');
    expect(events[2].data).toBe(50);
  });

  test('parseSSEChunk handles chunked HTML fragments', () => {
    const chunk1 = 'event: data\ndata: <div><p>Hello ';
    const chunk2 = 'world</p></div>\n\nevent: validation\ndata: {"passed":true}\n\n';

    const events: any[] = [];
    const remainder1 = parseSSEChunk(chunk1, (type, data) => {
      events.push({ type, data });
    });

    const remainder2 = parseSSEChunk(remainder1 + chunk2, (type, data) => {
      events.push({ type, data });
    });

    expect(events.length).toBeGreaterThanOrEqual(2);
    expect(events.some((e) => e.type === 'data')).toBe(true);
    expect(events.some((e) => e.type === 'validation')).toBe(true);
  });

  test('parseSSEChunk handles error event', () => {
    const chunk = 'event: error\ndata: {"status":500,"message":"Internal server error"}\n\n';
    const events: any[] = [];
    parseSSEChunk(chunk, (type, data) => {
      events.push({ type, data });
    });

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('error');
    expect(events[0].data.status).toBe(500);
  });

  test('parseSSEChunk handles validation event with complex JSON', () => {
    const chunk = `event: validation
data: {"passed":true,"issues":[],"confidenceScore":0.95}

`;
    const events: any[] = [];
    parseSSEChunk(chunk, (type, data) => {
      events.push({ type, data });
    });

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('validation');
    expect(events[0].data.passed).toBe(true);
    expect(events[0].data.issues).toEqual([]);
    expect(events[0].data.confidenceScore).toBe(0.95);
  });

  test('parseSSEChunk handles done event', () => {
    const chunk = 'event: done\ndata: {"success":true}\n\n';
    const events: any[] = [];
    parseSSEChunk(chunk, (type, data) => {
      events.push({ type, data });
    });

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('done');
    expect(events[0].data.success).toBe(true);
  });

  test('parseSSEChunk returns partial content as remainder', () => {
    const chunk = 'event: data\ndata: test\n\nincomplete_event';
    const events: any[] = [];
    const remainder = parseSSEChunk(chunk, (type, data) => {
      events.push({ type, data });
    });

    expect(events).toHaveLength(1);
    expect(remainder).toBe('incomplete_event');
  });

  test('parseSSEChunk handles newline variations (CRLF vs LF)', () => {
    // CRLF variant
    const crlfChunk = 'event: data\r\ndata: {"msg":"crlf"}\r\n\r\n';
    const crlfEvents: any[] = [];
    parseSSEChunk(crlfChunk, (type, data) => {
      crlfEvents.push({ type, data });
    });

    expect(crlfEvents).toHaveLength(1);
    expect(crlfEvents[0].data.msg).toBe('crlf');

    // Mixed variant
    const mixedChunk = 'event: data\r\ndata: {"msg":"mixed"}\n\n';
    const mixedEvents: any[] = [];
    parseSSEChunk(mixedChunk, (type, data) => {
      mixedEvents.push({ type, data });
    });

    expect(mixedEvents).toHaveLength(1);
    expect(mixedEvents[0].data.msg).toBe('mixed');
  });
});
