'use client';

import { useState, FormEvent } from 'react';

export default function GenerateContent() {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [category, setCategory] = useState('Technology');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; message: string }>(null);
  
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsGenerating(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          keywords: keywords.split(',').map(k => k.trim()),
          category,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          message: `Successfully generated blog post: "${data.title}". View it at /blog/${data.slug}`,
        });
        setTopic('');
        setKeywords('');
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to generate blog post',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred while generating the blog post',
      });
    } finally {
      setIsGenerating(false);
    }
  }
  
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Generate Blog Content</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Blog Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Best Gaming Laptops of 2023"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
              Keywords (comma separated)
            </label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., gaming laptop, RTX 3080, high performance, budget gaming"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="Technology">Technology</option>
              <option value="Gaming">Gaming</option>
              <option value="Home">Home</option>
              <option value="Fashion">Fashion</option>
              <option value="Health">Health</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isGenerating ? 'Generating...' : 'Generate Blog Post'}
          </button>
        </form>
        
        {result && (
          <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {result.message}
          </div>
        )}
      </div>
    </main>
  );
}