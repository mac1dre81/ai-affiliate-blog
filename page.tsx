'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Loading from '@/components/Loading';

// Dynamically import the BlogEditor component with SSR disabled
const BlogEditor = dynamic(
  () => import('@/components/BlogEditor'),
  { 
    ssr: false,
    loading: () => <Loading />
  }
);

export default function CreatePostPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <Suspense fallback={<Loading />}>
        <BlogEditor />
      </Suspense>
    </main>
  );
}