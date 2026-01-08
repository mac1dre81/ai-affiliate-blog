"use client";

import React from 'react';
import VisualEditor from '@/components/VisualEditor';

export default function Page() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Visual Editor Demo</h1>
      <p className="mb-4 text-sm text-gray-600">This demo shows the VisualEditor component and streaming behaviour.</p>
      <VisualEditor />
    </main>
  );
}
