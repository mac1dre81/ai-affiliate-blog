import { getOpenAI, ensureOpenAI } from './ai';
import config from './env-config';

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  content: string;
  publishedAt: string;
  keywords: string[];
  category: string;
};
export async function generateBlogPost(topic: string, keywords: string[], category: string) {
  let ai = getOpenAI();
  if (!ai) {
    // Friendly runtime error; surface during request handling rather than at module load
    // When OPENAI_API_KEY is missing, ensureOpenAI will throw with actionable guidance
    ai = ensureOpenAI();
  }
  
  const prompt = `
    Write a comprehensive blog post about ${topic}.
    Include the following keywords: ${keywords.join(', ')}.
    The blog post should be informative, engaging, and optimized for SEO.
    Include product recommendations with affiliate marketing opportunities.
    Format the content in markdown.
    
    The blog post should follow this structure:
    1. Attention-grabbing introduction that includes the main keyword
    2. Table of contents
    3. Several sections with h2 and h3 headings that include secondary keywords
    4. Product recommendations with clear benefits and features
    5. Comparison of different options
    6. Conclusion with a call to action
    
    Make sure the content is factually accurate, helpful to readers, and at least 1500 words long.
  `;
  
  const response = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL || (config as any).OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });
  
  const content = response.choices[0].message.content || '';
  
  // Generate a title if not provided
  const titlePrompt = `Create a catchy, SEO-friendly title for a blog post about ${topic} that includes the main keyword.`;
  const titleResponse = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL || (config as any).OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: titlePrompt }],
    temperature: 0.7,
    max_tokens: 50,
  });
  
  const title = titleResponse.choices[0].message.content?.replace(/"/g, '') || `Guide to ${topic}`;
  
  // Generate an excerpt
  const excerptPrompt = `Write a compelling 150-character excerpt for a blog post about ${topic} that will make readers want to click.`;
  const excerptResponse = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL || (config as any).OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: excerptPrompt }],
    temperature: 0.7,
    max_tokens: 100,
  });
  
  const excerpt = excerptResponse.choices[0].message.content?.replace(/"/g, '') || '';
  
  // Create slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
  
  return {
    slug,
    title,
    excerpt,
    content,
    coverImage: `https://picsum.photos/1600/900?random=${Date.now()}`,
    publishedAt: new Date().toISOString().split('T')[0],
    keywords,
    category
  };
}

// In a real implementation, you would store and retrieve from a database
let blogPosts: BlogPost[] = [
  {
    slug: 'best-laptops-2023',
    title: 'The 10 Best Laptops for Every Budget in 2023',
    excerpt: 'Find the perfect laptop for your needs, whether you\'re a student, professional, or gamer.',
    coverImage: 'https://picsum.photos/1600/900?random=1',
    content: `<h1>The 10 Best Laptops for Every Budget in 2023</h1>

<p>Finding the perfect laptop can be overwhelming with so many options available. Whether you're a student, professional, or gamer, we've compiled the ultimate guide to help you make the right choice for your needs and budget.</p>

<h2>Our Top Picks</h2>

<h3>1. MacBook Air M2 - Best Overall</h3>
<p><strong>Price: $1,199</strong></p>
<p>Apple's MacBook Air M2 continues to dominate the laptop market with its incredible performance, battery life, and sleek design. The M2 chip delivers exceptional speed for everything from basic tasks to video editing.</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Outstanding battery life (up to 18 hours)</li>
<li>Silent operation (fanless design)</li>
<li>Brilliant Retina display</li>
<li>Premium build quality</li>
</ul>
<p><strong>Best for:</strong> Content creators, students, professionals</p>

<h3>2. ASUS VivoBook 15 - Best Budget</h3>
<p><strong>Price: $449</strong></p>
<p>Don't let the low price fool you – the ASUS VivoBook 15 offers impressive value with solid performance for everyday tasks.</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Affordable price point</li>
<li>Full HD display</li>
<li>Decent performance for basic tasks</li>
<li>Multiple connectivity options</li>
</ul>
<p><strong>Best for:</strong> Budget-conscious users, basic computing needs</p>

<h3>3. Dell XPS 13 - Best for Professionals</h3>
<p><strong>Price: $999</strong></p>
<p>The Dell XPS 13 combines professional aesthetics with powerful performance in an ultra-portable package.</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Premium build quality</li>
<li>Excellent keyboard and trackpad</li>
<li>Sharp 4K display option</li>
<li>Compact design</li>
</ul>
<p><strong>Best for:</strong> Business professionals, frequent travelers</p>

<h3>4. ASUS ROG Zephyrus G14 - Best for Gaming</h3>
<p><strong>Price: $1,449</strong></p>
<p>This gaming laptop proves you don't need a massive, heavy machine to enjoy high-performance gaming.</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Powerful AMD Ryzen processor</li>
<li>Excellent graphics performance</li>
<li>Surprisingly portable</li>
<li>Good battery life for a gaming laptop</li>
</ul>
<p><strong>Best for:</strong> Gamers, content creators</p>

<h3>5. Surface Laptop 5 - Best 2-in-1</h3>
<p><strong>Price: $1,299</strong></p>
<p>Microsoft's Surface Laptop 5 offers the perfect blend of laptop and tablet functionality.</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Versatile 2-in-1 design</li>
<li>Excellent touchscreen</li>
<li>Premium materials</li>
<li>Great for digital artists</li>
</ul>
<p><strong>Best for:</strong> Creative professionals, students</p>

<h2>How to Choose the Right Laptop</h2>

<h3>Consider Your Budget</h3>
<p>Laptops range from $300 to $3000+. Determine your budget first, then find the best options within that range.</p>

<h3>Think About Usage</h3>
<p>Are you gaming, working, studying, or just browsing? Different tasks require different specifications.</p>

<h3>Key Specifications to Consider</h3>
<ul>
<li><strong>Processor:</strong> Intel Core i5/i7 or AMD Ryzen 5/7 for most users</li>
<li><strong>RAM:</strong> 8GB minimum, 16GB recommended</li>
<li><strong>Storage:</strong> SSD preferred over HDD for speed</li>
<li><strong>Display:</strong> 1080p minimum, consider 4K for creative work</li>
<li><strong>Battery Life:</strong> Look for 8+ hours for portability</li>
</ul>

<h2>Conclusion</h2>
<p>The best laptop for you depends on your specific needs and budget. Whether you choose the premium MacBook Air M2, the budget-friendly ASUS VivoBook, or a gaming powerhouse like the ROG Zephyrus, make sure it aligns with how you plan to use it.</p>

<p>Remember to consider factors like warranty, customer support, and upgrade options when making your final decision. Happy laptop hunting!</p>`,
    publishedAt: '2023-05-15',
    keywords: ['laptop', 'MacBook', 'Windows laptop', 'budget laptop', 'gaming laptop'],
    category: 'Technology'
  },
  {
    slug: 'smart-home-devices',
    title: 'Must-Have Smart Home Devices in 2023',
    excerpt: 'Transform your home with these cutting-edge smart devices that combine convenience and innovation.',
    coverImage: 'https://picsum.photos/1600/900?random=2',
    content: `<h1>Must-Have Smart Home Devices in 2023</h1>

<p>Smart home technology has revolutionized the way we interact with our living spaces. From voice-controlled assistants to automated lighting systems, these devices offer unprecedented convenience, security, and energy efficiency.</p>

<h2>Top Smart Home Devices to Consider</h2>

<h3>1. Smart Speakers - The Command Center</h3>
<p><strong>Best Pick: Amazon Echo Dot (5th Gen) - $49.99</strong></p>
<p>Smart speakers serve as the central hub for your smart home ecosystem. They can control other devices, play music, answer questions, and even make calls.</p>
<p><strong>Key Features:</strong></p>
<ul>
<li>Voice control for all connected devices</li>
<li>Music streaming from various platforms</li>
<li>Weather updates and news briefings</li>
<li>Smart home automation routines</li>
</ul>

<h3>2. Smart Lighting - Ambiance on Demand</h3>
<p><strong>Best Pick: Philips Hue White Starter Kit - $99.99</strong></p>
<p>Smart bulbs allow you to control lighting remotely, set schedules, and create custom ambiance for any occasion.</p>
<p><strong>Benefits:</strong></p>
<ul>
<li>Energy savings up to 80%</li>
<li>Customizable color and brightness</li>
<li>Schedule automation</li>
<li>Integration with voice assistants</li>
</ul>

<h3>3. Smart Thermostats - Climate Control</h3>
<p><strong>Best Pick: Google Nest Learning Thermostat - $249.99</strong></p>
<p>Smart thermostats learn your preferences and automatically adjust temperature to optimize comfort and energy savings.</p>
<p><strong>Advantages:</strong></p>
<ul>
<li>Learns your schedule automatically</li>
<li>Remote control via smartphone</li>
<li>Energy usage reports</li>
<li>Potential savings of $131-145 annually</li>
</ul>

<h3>4. Smart Security Cameras - Peace of Mind</h3>
<p><strong>Best Pick: Ring Video Doorbell 4 - $199.99</strong></p>
<p>Monitor your home 24/7 with smart security cameras that offer real-time alerts and video recording.</p>
<p><strong>Features:</strong></p>
<ul>
<li>HD video quality</li>
<li>Motion detection alerts</li>
<li>Two-way audio communication</li>
<li>Cloud storage options</li>
</ul>

<h3>5. Smart Plugs - Easy Automation</h3>
<p><strong>Best Pick: Amazon Smart Plug - $24.99</strong></p>
<p>Transform any regular appliance into a smart device with these affordable plugs.</p>
<p><strong>Uses:</strong></p>
<ul>
<li>Schedule lamps and appliances</li>
<li>Remote control of devices</li>
<li>Energy monitoring</li>
<li>Voice control integration</li>
</ul>

<h2>Getting Started with Smart Home</h2>

<h3>Step 1: Choose Your Ecosystem</h3>
<p>Decide between Amazon Alexa, Google Assistant, or Apple HomeKit. Each has its strengths and compatible device selection.</p>

<h3>Step 2: Start Small</h3>
<p>Begin with one or two devices like a smart speaker and smart bulbs. This allows you to get comfortable with the technology before expanding.</p>

<h3>Step 3: Ensure Strong Wi-Fi</h3>
<p>Smart home devices require reliable internet connectivity. Consider upgrading your router if you experience connection issues.</p>

<h2>Budget Considerations</h2>
<p>You can start building a smart home for under $200 with a few key devices:</p>
<ul>
<li>Smart Speaker: $50</li>
<li>Smart Bulb Starter Kit: $100</li>
<li>Smart Plug (2-pack): $30</li>
<li>Total: $180</li>
</ul>

<h2>Privacy and Security Tips</h2>
<ul>
<li>Regularly update device firmware</li>
<li>Use strong, unique passwords</li>
<li>Review privacy settings for each device</li>
<li>Consider devices with local processing capabilities</li>
</ul>

<h2>Conclusion</h2>
<p>Smart home technology offers incredible convenience and can even help reduce energy costs. Start with a few key devices and gradually expand your setup as you become more comfortable with the technology. The future of home automation is here, and it's more accessible than ever.</p>`,
    publishedAt: '2023-06-02',
    keywords: ['smart home', 'Alexa', 'Google Home', 'smart speaker', 'home automation'],
    category: 'Technology'
  },
  {
    slug: 'best-wireless-earbuds',
    title: 'The 7 Best Wireless Earbuds for Every Situation',
    excerpt: 'From workouts to work calls, find the perfect wireless earbuds for your lifestyle.',
    coverImage: 'https://picsum.photos/1600/900?random=3',
    content: '# The 7 Best Wireless Earbuds for Every Situation\n\nWireless earbuds have become essential accessories in our daily lives. Here\'s our guide to the best options for every need.\n\n## Table of Contents\n\n1. [Best Overall Earbuds](#best-overall)\n2. [Best for Apple Users](#best-for-apple)\n3. [Best for Android Users](#best-for-android)\n4. [Best for Workouts](#best-for-workouts)\n5. [Best Budget Option](#best-budget)\n6. [Best for Noise Cancellation](#best-noise-cancellation)\n7. [Best for Battery Life](#best-battery-life)\n\n## Best Overall Earbuds {#best-overall}\n\nThe Sony WF-1000XM4 earbuds offer the perfect combination of sound quality, noise cancellation, and comfort...\n\n[Rest of content would be here]',
    publishedAt: '2023-06-10',
    keywords: ['wireless earbuds', 'Bluetooth earbuds', 'AirPods', 'noise-cancelling earbuds', 'workout earbuds'],
    category: 'Technology'
  },
];

export async function getBlogPosts(): Promise<BlogPost[]> {
  // In a real implementation, you would fetch from a database
  return blogPosts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // In a real implementation, you would fetch from a database
  return blogPosts.find(post => post.slug === slug) || null;
}

export async function createBlogPost(post: BlogPost): Promise<BlogPost> {
  // In a real implementation, you would save to a database
  blogPosts.push(post);
  return post;
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  return blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

export async function searchPosts(query: string): Promise<BlogPost[]> {
  const lowerQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowerQuery) ||
    post.excerpt.toLowerCase().includes(lowerQuery) ||
    post.content.toLowerCase().includes(lowerQuery) ||
    post.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
  );
}