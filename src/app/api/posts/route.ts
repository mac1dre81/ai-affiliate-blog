import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Post from '@/models/post';

export async function GET() {
  try {
    await connectDB(process.env.DATABASE_URL!);
    if (!Post) throw new Error('Post model not initialized');
    const posts = await Post.find({ published: true })
      .sort({ publishedAt: -1 })
      .limit(10);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB(process.env.DATABASE_URL!);
    const body = await request.json();
    
    if (!Post) throw new Error('Post model not initialized');
    const post = new Post({
      ...body,
      publishedAt: body.published ? new Date() : null
    });
    
    await post.save();
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
