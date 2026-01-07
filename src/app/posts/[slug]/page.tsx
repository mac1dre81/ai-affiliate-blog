import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  tags: string[];
  coverImage?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/${resolvedParams.slug}`);
    if (!res.ok) return {};

    const post: Post = await res.json();
    
    return {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      openGraph: {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt,
        type: 'article',
        publishedTime: post.publishedAt,
        images: post.coverImage ? [{
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }] : [],
      },
    };
  } catch (error) {
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let post: Post | null = null;
  
  try {
    const resolvedParams = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/${resolvedParams.slug}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error('Failed to fetch post');
    }
    
    post = await res.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <time dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
          </time>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 ml-4">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {post.title}
        </h1>
        
        {post.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {post.excerpt}
          </p>
        )}
        
        {post.coverImage && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      <div className="prose dark:prose-invert max-w-none">
        <div>
          <p>{post.content}</p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/posts"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          ← Back to all posts
        </Link>
      </div>
    </article>
  );
}
