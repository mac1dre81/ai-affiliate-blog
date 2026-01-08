"use client";

import React from 'react';
import VisualEditor from '@/components/VisualEditor';

export default function Page() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Visual Editor</h1>
      <VisualEditor />
    </main>
  );
}
