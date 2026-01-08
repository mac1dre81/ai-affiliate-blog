import Link from 'next/link';
import { format } from 'date-fns';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Posts',
  description: 'Browse all our blog posts',
};

type Post = {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  tags: string[];
  coverImage?: string;
};

export default async function BlogPostsPage() {
  let posts: Post[] = [];
  
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://tecmarketa.com';
    const res = await fetch(`${base}/api/posts`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (res.ok) {
      posts = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Latest articles and tutorials
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            No posts yet
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Check back later for new content!
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post._id} className="group">
              <Link href={`/posts/${post.slug}`}>
                <div className="h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  {post.coverImage && (() => {
                    const sanitizeUrl = (u?: string) => {
                      if (!u) return undefined;
                      try {
                        const parsed = new URL(u);
                        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.toString();
                      } catch (e) {
                        return undefined;
                      }
                      return undefined;
                    };
                    const safe = sanitizeUrl(post.coverImage);
                    return safe ? (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={safe}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : null;
                  })()}

                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <time dateTime={post.publishedAt}>
                        {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                      </time>
                      {post.tags?.length > 0 && (
                        <span className="mx-2">•</span>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags?.length > 2 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                      Read more →
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
