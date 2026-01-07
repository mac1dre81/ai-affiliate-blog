import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost, createBlogPost } from '@/lib/blog';

export async function POST(request: NextRequest) {
  try {
    const { topic, keywords, category } = await request.json();
    
    if (!topic || !keywords || !Array.isArray(keywords) || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const post = await generateBlogPost(topic, keywords, category);
    await createBlogPost(post);
    
    return NextResponse.json({
      success: true,
      slug: post.slug,
      title: post.title
    });
  } catch (error) {
    console.error('Error generating post:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}