import { NextResponse } from 'next/server';
import { generateBlogPost, generatePostMetadata } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { topic, tone, length, keywords } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const [content, metadata] = await Promise.all([
      generateBlogPost({ topic, tone, length, keywords }),
      generatePostMetadata(topic, '')
    ]);

    return NextResponse.json({
      title: topic,
      content,
      ...metadata,
      aiGenerated: true
    });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
