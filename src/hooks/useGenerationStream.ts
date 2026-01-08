"use client";

import { useState, useRef, useCallback } from 'react';

type GenerationEvent = { type: string; data: any };

// Exported for unit testing the SSE parser
export function parseSSEChunk(buffer: string, onEvent: (type: string, data: any) => void) {
  // split on double newline for events
  const parts = buffer.split(/\r?\n\r?\n/);
  // last part may be incomplete — return it so caller can keep remainder
  const remainder = parts.pop() ?? '';

  for (const part of parts) {
    if (!part.trim()) continue;
    const lines = part.split(/\r?\n/);
    let type = 'message';
    let dataLines: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('event:')) {
        type = trimmed.slice('event:'.length).trim();
      } else if (trimmed.startsWith('data:')) {
        dataLines.push(trimmed.slice('data:'.length).trim());
      }
    }
    const raw = dataLines.join('\n');
    let parsed: any = raw;
    // try parse JSON
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      // not JSON — keep raw string
    }
    onEvent(type, parsed);
  }

  return remainder;
}

export default function useGenerationStream() {
  const [events, setEvents] = useState<GenerationEvent[]>([]);
  const controllerRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  const pushEvent = useCallback((ev: GenerationEvent) => {
    setEvents((prev) => [...prev, ev]);
  }, []);

  const clear = useCallback(() => {
    // abort running request if any
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setEvents([]);
  }, []);

  // The hook uses the exported `parseSSEChunk` above. Additionally, the hook will
  // detect bare HTML chunk streams (non-SSE) and surface them as `data` events.

  const startGeneration = useCallback(async (payload: { description: string; preferences?: any; userId?: string }) => {
    clear();
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    const res = await fetch('/api/generate-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });

    if (!res.ok) {
      const text = await res.text();
      pushEvent({ type: 'error', data: { status: res.status, body: text } });
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('Readable stream not available from response');
    readerRef.current = reader;
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // parse complete SSE events from buffer
        buffer = parseSSEChunk(buffer, (type, data) => {
          pushEvent({ type, data });
        });

        // If buffer now contains obvious HTML fragments (server may stream raw
        // HTML without SSE framing), detect and emit incremental `data` events.
        // We look for a '<' character as a cheap heuristic. Don't aggressively
        // consume buffer here — only emit when buffer contains a full tag or
        // when it's reasonably large.
        if (buffer.includes('<') && buffer.length > 64) {
          // emit as partial HTML and clear buffer
          pushEvent({ type: 'data', data: buffer });
          buffer = '';
        }
      }

      // flush any remaining content
      if (buffer.trim()) {
        // If it looks like SSE remainder, try parse; otherwise emit as data
        const remainingAfterParse = parseSSEChunk(buffer, (type, data) => {
          pushEvent({ type, data });
        });
        if (remainingAfterParse && remainingAfterParse.trim()) {
          pushEvent({ type: 'data', data: remainingAfterParse });
        }
      }

      pushEvent({ type: 'end', data: null });
    } catch (err) {
      if ((err as any)?.name === 'AbortError') {
        pushEvent({ type: 'aborted', data: null });
      } else {
        pushEvent({ type: 'error', data: String(err) });
      }
    } finally {
      try {
        await reader.cancel();
      } catch {}
      readerRef.current = null;
      controllerRef.current = null;
    }
  }, [clear, pushEvent]);

  return {
    events,
    startGeneration,
    clear,
  } as const;
}
