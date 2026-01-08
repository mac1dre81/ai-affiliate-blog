"use client";

import React, { useState, useCallback, useEffect } from 'react';
import useGenerationStream from '@/hooks/useGenerationStream';

export default function VisualEditor() {
  const [description, setDescription] = useState<string>('A modern landing page for a boutique coffee shop');
  const [isGenerating, setIsGenerating] = useState(false);
  const { events, startGeneration, clear } = useGenerationStream();
  const [toasts, setToasts] = useState<string[]>([]);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [progressPct, setProgressPct] = useState<number>(0);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    clear();
    try {
      await startGeneration({ description, preferences: { designStyle: 'modern', contentTone: 'friendly', performancePriority: 'high' }, userId: 'local-user' });
    } catch (err) {
      console.error('generation error', err);
    } finally {
      setIsGenerating(false);
    }
  }, [description, startGeneration, clear]);

  // show toasts and update simple UI state when new events arrive
  useEffect(() => {
    if (events.length === 0) return;
    const latest = events[events.length - 1];

    // Credit updates
    if (latest.type === 'credits' || latest.type === 'reserved') {
      const n = typeof latest.data === 'number' ? latest.data : (latest.data?.remaining ?? null);
      setCreditsRemaining(typeof n === 'number' ? n : null);
      setToasts((t) => [...t, `Credits updated: ${JSON.stringify(latest.data)}`]);
    }

    if (latest.type === 'progress') {
      const pct = typeof latest.data === 'number' ? latest.data : (latest.data?.pct ?? 0);
      setProgressPct(Math.max(0, Math.min(100, pct)));
    }

    if (latest.type === 'error') {
      setToasts((t) => [...t, `Error: ${String(latest.data)}`]);
    }

    if (latest.type === 'end') {
      setToasts((t) => [...t, 'Generation complete']);
      setProgressPct(100);
    }

    if (latest.type === 'aborted') {
      setToasts((t) => [...t, 'Generation cancelled']);
      setIsGenerating(false);
    }
  }, [events]);

  return (
    <div className="grid grid-cols-2 gap-6">
      <section>
        <label className="block text-sm font-medium">Project Description</label>
        <textarea
          className="w-full h-48 p-3 border rounded mt-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="mt-3">
          <div className="flex items-center">
            <button
              className={`px-4 py-2 rounded bg-blue-600 text-white ${isGenerating ? 'opacity-60' : ''}`}
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating…' : 'Generate'}
            </button>
            <button className="ml-2 px-3 py-2 border rounded" onClick={() => { clear(); setIsGenerating(false); }}>
              Cancel
            </button>
            <div className="ml-4 text-sm text-gray-600">
              <span className="mr-2">Credits:</span>
              <strong>{creditsRemaining ?? '—'}</strong>
            </div>
          </div>

          {/* small progress bar */}
          <div className="mt-3 h-2 bg-gray-200 rounded overflow-hidden" aria-hidden>
            <div className="h-full bg-green-500" style={{ width: `${progressPct}%`, transition: 'width 300ms' }} />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Event Log</h3>
          <div className="mt-2 p-3 bg-gray-50 border rounded h-48 overflow-auto text-xs">
            {events.length === 0 && <div className="text-gray-500">No events yet. Click Generate to start.</div>}
            {events.map((ev, idx) => (
              <div key={idx} className="mb-2">
                <div className="text-xs text-gray-600">{ev.type}</div>
                <pre className="whitespace-pre-wrap">{typeof ev.data === 'string' ? ev.data : JSON.stringify(ev.data, null, 2)}</pre>
              </div>
            ))}
          </div>

          {/* Toast area */}
          <div className="fixed bottom-4 right-4 w-80 space-y-2 pointer-events-none">
            {toasts.slice(-5).map((t, i) => (
              <div key={i} className="pointer-events-auto bg-black text-white p-2 rounded text-sm shadow">{t}</div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-semibold">Preview</h3>
        <div className="mt-2 border rounded h-96 overflow-auto bg-white p-4" style={{ fontFamily: 'system-ui' }}>
          {/* Render HTML content events as they arrive. Look for data events with HTML strings. */}
          {events
            .filter((e) => e.type === 'data')
            .map((e, i) => (
              <div key={i} dangerouslySetInnerHTML={{ __html: String(e.data) }} />
            ))}

          {/* Validation event */}
          {events.filter((e) => e.type === 'validation').map((e, i) => (
            <div key={`val-${i}`} className="mt-4 p-3 border-t text-sm text-gray-700">
              <strong>Validation:</strong>
              <pre className="whitespace-pre-wrap">{JSON.stringify(e.data, null, 2)}</pre>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
