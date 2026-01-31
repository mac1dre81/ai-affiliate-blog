import { getBlogPosts } from "@/lib/blog";
import { AffiliateProductCard } from "@/components/AffiliateProductCard";
import { BlogImage } from "@/components/BlogImage";
import Link from "next/link";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">Post not found</h1>
        <p>The blog post you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          ← Back to home
        </Link>
      </div>
    );
  }

  // In a real implementation, you would track views here

  return (
    <div className="container mx-auto p-4">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to home
      </Link>

      {post.coverImage && (
        <BlogImage src={post.coverImage} alt={post.title} title={post.title} />
      )}

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-8">Published on {post.publishedAt}</p>

      <div
        className="blog-content prose lg:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Recommended Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {post.slug === "best-laptops-2023" && (
            <>
              <AffiliateProductCard
                title="MacBook Air M2"
                description="Apple's latest MacBook Air with M2 chip. Perfect for students and professionals. Up to 18 hours of battery life."
                linkId="macbook_air_m2"
                href="https://www.amazon.com/dp/B0B3C2R8MP?tag=yourtag-20"
              />
              <AffiliateProductCard
                title="ASUS VivoBook 15"
                description="Best budget laptop under $500. Great for everyday tasks, streaming, and light work. Full HD display included."
                linkId="asus_vivobook_15"
                href="https://www.amazon.com/dp/B09MDFKKZ9?tag=yourtag-20"
              />
            </>
          )}
          {post.slug === "smart-home-devices" && (
            <>
              <AffiliateProductCard
                title="Amazon Echo Dot (5th Gen)"
                description="The best smart speaker for beginners. Control your smart home, play music, and ask questions."
                linkId="echo_dot_5th"
                href="https://www.amazon.com/dp/B09B8V1LZ3?tag=yourtag-20"
              />
              <AffiliateProductCard
                title="Philips Hue White Starter Kit"
                description="Transform your lighting with smart bulbs. Control brightness, set schedules, and save energy."
                linkId="philips_hue_starter"
                href="https://www.amazon.com/dp/B07354SP1X?tag=yourtag-20"
              />
            </>
          )}
          {post.slug === "best-wireless-earbuds" && (
            <>
              <AffiliateProductCard
                title="Apple AirPods Pro (2nd Gen)"
                description="Industry-leading noise cancellation and spatial audio. Perfect for iPhone users. 6 hours playtime."
                linkId="airpods_pro_2nd"
                href="https://www.amazon.com/dp/B0BDHWDR12?tag=yourtag-20"
              />
              <AffiliateProductCard
                title="Sony WF-1000XM4"
                description="Best overall wireless earbuds. Exceptional sound quality and noise cancellation. 8 hours battery life."
                linkId="sony_wf_1000xm4"
                href="https://www.amazon.com/dp/B094C4VDJZ?tag=yourtag-20"
              />
            </>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts
            .filter((p) => p.slug !== post.slug)
            .slice(0, 3)
            .map((relatedPost) => (
              <div
                key={relatedPost.slug}
                className="border rounded-lg overflow-hidden shadow-md"
              >
                {relatedPost.coverImage && (
                  <img
                    src={relatedPost.coverImage}
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{relatedPost.excerpt}</p>
                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
