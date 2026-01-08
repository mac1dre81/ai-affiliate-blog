import OpenAI from 'openai';

export function getOpenAI(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

/**
 * Ensure OpenAI is available at runtime or throw a friendly error.
 * Call this inside request handlers where a missing key should surface as an actionable error.
 */
export function ensureOpenAI(): OpenAI {
  const client = getOpenAI();
  if (!client) {
    throw new Error(
      'OpenAI is not configured. Set the environment variable OPENAI_API_KEY to enable AI features. See README for setup.'
    );
  }
  return client;
}

type GeneratePostOptions = {
  topic: string;
  tone?: 'professional' | 'casual' | 'enthusiastic' | 'informative';
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
};

export async function generateBlogPost({
  topic,
  tone = 'informative',
  length = 'medium',
  keywords = [],
}: GeneratePostOptions) {
  try {
    const prompt = `Write a ${length} blog post about "${topic}" with a ${tone} tone. ${
      keywords.length > 0 ? `Include these keywords: ${keywords.join(', ')}. ` : ''
    }The post should be well-structured with an introduction, main points, and conclusion.`;

    const client = ensureOpenAI();
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional blog writer with expertise in creating engaging and informative content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: process.env.OPENAI_MODEL || 'gpt-4',
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating blog post:', error);
    throw new Error('Failed to generate blog post');
  }
}

export async function generatePostMetadata(title: string, content: string) {
  try {
    const prompt = `Generate SEO metadata for this blog post:
    
    Title: ${title}
    
    Content: ${content.substring(0, 1000)}...
    
    Return a JSON object with these fields:
    - metaTitle: A compelling meta title (50-60 chars)
    - metaDescription: A compelling meta description (120-160 chars)
    - excerpt: A short excerpt for the post preview (max 160 chars)
    - tags: An array of 3-5 relevant tags
    `;

    const client = ensureOpenAI();
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert that generates optimized metadata for blog posts.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) throw new Error('No content generated');

    return JSON.parse(result) as {
      metaTitle: string;
      metaDescription: string;
      excerpt: string;
      tags: string[];
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      metaTitle: title,
      metaDescription: content.substring(0, 155) + '...',
      excerpt: content.substring(0, 155) + '...',
      tags: [],
    };
  }
}
