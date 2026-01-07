'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type FormData = {
  title: string;
  content: string;
  excerpt: string;
  tags: string;
  published: boolean;
};

export default function BlogEditor() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const generateWithAI = async () => {
    const title = watch('title');
    if (!title) {
      setError('Please enter a topic/title first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: title }),
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const { content, excerpt, tags } = await response.json();
      
      setValue('content', content);
      setValue('excerpt', excerpt);
      setValue('tags', tags.join(', '));
    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) throw new Error('Failed to save post');
      
      const result = await response.json();
      router.push(`/posts/${result.slug}`);
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save post. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="title"
              {...register('title', { required: 'Title is required' })}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter post title"
            />
            <button
              type="button"
              onClick={generateWithAI}
              disabled={isGenerating}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Excerpt
          </label>
          <div className="mt-1">
            <textarea
              id="excerpt"
              rows={3}
              {...register('excerpt')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="A brief summary of your post"
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <div className="mt-1">
            <textarea
              id="content"
              rows={12}
              {...register('content', { required: 'Content is required' })}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md font-mono"
              placeholder="Write your post content here..."
            />
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="tags"
              {...register('tags')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="tag1, tag2, tag3"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="published"
            type="checkbox"
            {...register('published')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
            Publish immediately
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
