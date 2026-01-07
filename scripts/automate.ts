import { connectDB } from '../src/lib/database';
import { generateBlogPost } from '../src/lib/blog';
import Post from '../src/models/post';
import AffiliateProduct from '../src/models/product';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGO_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/ai-blog';

/**
 * Mock function to simulate fetching latest prices from affiliate APIs/Scrapers
 */
async function updateProductPrices() {
  console.log('Updating product prices...');
  const products = await AffiliateProduct.find({ active: true });
  
  for (const product of products) {
    // In a real scenario, you'd call Amazon/BestBuy API or a scraper here
    // For now, we simulate a slight price change
    const priceChange = (Math.random() - 0.5) * 2; // -1 to +1
    product.price = Math.max(0, product.price + priceChange);
    product.lastChecked = new Date();
    await product.save();
    console.log(`Updated ${product.name}: $${product.price.toFixed(2)}`);
  }
}

/**
 * Automatically generates a new blog post based on a trending topic or category
 */
async function autoGenerateContent() {
  console.log('Generating autonomous content...');
  
  const categories = ['Technology', 'Smart Home', 'Lifestyle', 'Health'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  // Find products in this category to feature
  const products = await AffiliateProduct.find({ category, active: true }).limit(3);
  
  if (products.length === 0) {
    console.log(`No products found for category ${category}. Skipping generation.`);
    return;
  }

  const topic = `Best ${category} products for ${new Date().getFullYear()}`;
  const keywords = [category, ...products.map(p => p.name)];

  const postData = await generateBlogPost(topic, keywords, category);
  
  // Map featured products to post
  const affiliateLinks = products.map(p => ({
    url: p.affiliateUrl,
    title: p.name,
    description: p.description
  }));

  const newPost = new Post({
    ...postData,
    affiliateLinks,
    published: true,
    publishedAt: new Date(),
    aiGenerated: true,
    // Note: author needs a valid ObjectId in a real system
    author: '000000000000000000000000' as any 
  });

  await newPost.save();
  console.log(`Successfully generated and published post: ${newPost.title}`);
}

async function run() {
  try {
    await connectDB(MONGO_URI);
    
    // 1. Update prices for all tracked products
    await updateProductPrices();
    
    // 2. Generate a new post (could be conditioned on schedule)
    await autoGenerateContent();
    
    console.log('Automation task completed.');
    process.exit(0);
  } catch (error) {
    console.error('Automation task failed:', error);
    process.exit(1);
  }
}

run();
