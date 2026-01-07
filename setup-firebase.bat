@echo off
echo 🚀 Setting up Firebase as Mongoose replacement...
echo.

echo 📦 Removing Mongoose...
call npm uninstall mongoose @types/mongoose 2>nul

echo 📦 Installing Firebase...
call npm install firebase firebase-admin

echo 📦 Installing other needed packages...
call npm install openai cheerio
call npm install --save-dev @types/node @types/cheerio

echo.
echo 🔥 Setting up Firebase files...
echo.

echo 📁 Creating Firebase configuration...
mkdir src\lib\firebase 2>nul

(
echo // src/lib/firebase/config.ts
echo // Firebase configuration - replace with your actual credentials
echo 
echo import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
echo import { getFirestore, Firestore } from 'firebase/firestore';
echo import { getAuth, Auth } from 'firebase/auth';
echo import { getStorage, FirebaseStorage } from 'firebase/storage';
echo 
echo const firebaseConfig = {
echo   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
echo   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
echo   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
echo   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
echo   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
echo   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
echo   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
echo };
echo 
echo // Initialize Firebase
echo let app: FirebaseApp;
echo let db: Firestore;
echo let auth: Auth;
echo let storage: FirebaseStorage;
echo 
echo if (!getApps().length) {
echo   app = initializeApp(firebaseConfig);
echo   db = getFirestore(app);
echo   auth = getAuth(app);
echo   storage = getStorage(app);
echo } else {
echo   app = getApps()[0];
echo   db = getFirestore(app);
echo   auth = getAuth(app);
echo   storage = getStorage(app);
echo }
echo 
echo export { app, db, auth, storage };
) > src\lib\firebase\config.ts

echo.
echo 📝 Creating Firebase models (replacing Mongoose models)...
mkdir src\models 2>nul

(
echo // src/models/post.ts - Firebase Firestore model (replaces Mongoose)
echo import { db } from '@/lib/firebase/config';
echo import { 
echo   collection,
echo   doc,
echo   getDoc,
echo   getDocs,
echo   addDoc,
echo   updateDoc,
echo   deleteDoc,
echo   query,
echo   where,
echo   orderBy,
echo   limit,
echo   Timestamp,
echo   DocumentData,
echo } from 'firebase/firestore';
echo 
echo export interface Post {
echo   id?: string; // Firestore auto-generates IDs
echo   title: string;
echo   slug: string;
echo   content: string;
echo   excerpt?: string;
echo   author?: string;
echo   category?: string;
echo   tags?: string[];
echo   featuredImage?: string;
echo   published: boolean;
echo   publishedAt?: Date;
echo   createdAt: Date;
echo   updatedAt: Date;
echo   affiliateLinks?: Array<{
echo     product: string;
echo     url: string;
echo     price?: number;
echo     commission?: number;
echo   }>;
echo   seo?: {
echo     title?: string;
echo     description?: string;
echo     keywords?: string[];
echo   };
echo   aiGenerated?: boolean;
echo   wordCount?: number;
echo   readingTime?: number;
echo }
echo 
echo // Convert Firestore timestamp to Date
echo const convertTimestamp = (timestamp: any): Date => {
echo   if (timestamp?.toDate) return timestamp.toDate();
echo   if (timestamp instanceof Date) return timestamp;
echo   return new Date(timestamp);
echo };
echo 
echo // Convert Post to Firestore data
echo const postToFirestore = (post: Post): DocumentData => {
echo   return {
echo     ...post,
echo     publishedAt: post.publishedAt ? Timestamp.fromDate(post.publishedAt) : null,
echo     createdAt: post.createdAt ? Timestamp.fromDate(post.createdAt) : Timestamp.now(),
echo     updatedAt: Timestamp.now(),
echo   };
echo };
echo 
echo // Convert Firestore document to Post
echo const firestoreToPost = (doc: DocumentData): Post => {
echo   const data = doc.data();
echo   return {
echo     id: doc.id,
echo     title: data.title,
echo     slug: data.slug,
echo     content: data.content,
echo     excerpt: data.excerpt || '',
echo     author: data.author || 'Admin',
echo     category: data.category || 'Uncategorized',
echo     tags: data.tags || [],
echo     featuredImage: data.featuredImage || '',
echo     published: data.published || false,
echo     publishedAt: data.publishedAt ? convertTimestamp(data.publishedAt) : undefined,
echo     createdAt: convertTimestamp(data.createdAt),
echo     updatedAt: convertTimestamp(data.updatedAt),
echo     affiliateLinks: data.affiliateLinks || [],
echo     seo: data.seo || {},
echo     aiGenerated: data.aiGenerated || false,
echo     wordCount: data.wordCount || 0,
echo     readingTime: data.readingTime || 0,
echo   };
echo };
echo 
echo // Firestore collection reference
echo const postsCollection = collection(db, 'posts');
echo 
echo // CRUD Operations
echo export const postModel = {
echo   // Get all published posts
echo   async getPublishedPosts(limitCount: number = 10): Promise<Post[]> {
echo     try {
echo       const q = query(
echo         postsCollection,
echo         where('published', '==', true),
echo         orderBy('publishedAt', 'desc'),
echo         limit(limitCount)
echo       );
echo       
echo       const querySnapshot = await getDocs(q);
echo       return querySnapshot.docs.map(firestoreToPost);
echo     } catch (error) {
echo       console.error('Error getting posts:', error);
echo       return [];
echo     }
echo   },
echo 
echo   // Get post by slug
echo   async getPostBySlug(slug: string): Promise<Post | null> {
echo     try {
echo       const q = query(postsCollection, where('slug', '==', slug));
echo       const querySnapshot = await getDocs(q);
echo       
echo       if (querySnapshot.empty) return null;
echo       
echo       return firestoreToPost(querySnapshot.docs[0]);
echo     } catch (error) {
echo       console.error('Error getting post by slug:', error);
echo       return null;
echo     }
echo   },
echo 
echo   // Get post by ID
echo   async getPostById(id: string): Promise<Post | null> {
echo     try {
echo       const docRef = doc(db, 'posts', id);
echo       const docSnap = await getDoc(docRef);
echo       
echo       if (!docSnap.exists()) return null;
echo       
echo       return firestoreToPost(docSnap);
echo     } catch (error) {
echo       console.error('Error getting post by ID:', error);
echo       return null;
echo     }
echo   },
echo 
echo   // Create new post
echo   async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
echo     try {
echo       const postWithTimestamps = {
echo         ...postData,
echo         createdAt: new Date(),
echo         updatedAt: new Date(),
echo       };
echo       
echo       const firestoreData = postToFirestore(postWithTimestamps);
echo       const docRef = await addDoc(postsCollection, firestoreData);
echo       
echo       return {
echo         ...postWithTimestamps,
echo         id: docRef.id,
echo       };
echo     } catch (error) {
echo       console.error('Error creating post:', error);
echo       throw error;
echo     }
echo   },
echo 
echo   // Update post
echo   async updatePost(id: string, updates: Partial<Post>): Promise<boolean> {
echo     try {
echo       const docRef = doc(db, 'posts', id);
echo       const updateData = {
echo         ...updates,
echo         updatedAt: Timestamp.now(),
echo       };
echo       
echo       // Remove id from updates if present
echo       delete (updateData as any).id;
echo       
echo       await updateDoc(docRef, updateData);
echo       return true;
echo     } catch (error) {
echo       console.error('Error updating post:', error);
echo       return false;
echo     }
echo   },
echo 
echo   // Delete post
echo   async deletePost(id: string): Promise<boolean> {
echo     try {
echo       const docRef = doc(db, 'posts', id);
echo       await deleteDoc(docRef);
echo       return true;
echo     } catch (error) {
echo       console.error('Error deleting post:', error);
echo       return false;
echo     }
echo   },
echo 
echo   // Get posts by category
echo   async getPostsByCategory(category: string, limitCount: number = 10): Promise<Post[]> {
echo     try {
echo       const q = query(
echo         postsCollection,
echo         where('published', '==', true),
echo         where('category', '==', category),
echo         orderBy('publishedAt', 'desc'),
echo         limit(limitCount)
echo       );
echo       
echo       const querySnapshot = await getDocs(q);
echo       return querySnapshot.docs.map(firestoreToPost);
echo     } catch (error) {
echo       console.error('Error getting posts by category:', error);
echo       return [];
echo     }
echo   },
echo 
echo   // Get all posts (including unpublished - for admin)
echo   async getAllPosts(limitCount: number = 50): Promise<Post[]> {
echo     try {
echo       const q = query(
echo         postsCollection,
echo         orderBy('createdAt', 'desc'),
echo         limit(limitCount)
echo       );
echo       
echo       const querySnapshot = await getDocs(q);
echo       return querySnapshot.docs.map(firestoreToPost);
echo     } catch (error) {
echo       console.error('Error getting all posts:', error);
echo       return [];
echo     }
echo   },
echo };
) > src\models\post.ts

echo.
echo 📝 Creating affiliate product model...
(
echo // src/models/affiliate.ts - Affiliate products in Firestore
echo import { db } from '@/lib/firebase/config';
echo import { 
echo   collection,
echo   doc,
echo   getDoc,
echo   getDocs,
echo   addDoc,
echo   updateDoc,
echo   deleteDoc,
echo   query,
echo   where,
echo   orderBy,
echo   limit,
echo   Timestamp,
echo   DocumentData,
echo } from 'firebase/firestore';
echo 
echo export interface AffiliateProduct {
echo   id?: string;
echo   name: string;
echo   description: string;
echo   price: number;
echo   originalPrice?: number;
echo   affiliateLink: string;
echo   commission: number; // percentage
echo   category: string;
echo   tags: string[];
echo   imageUrl: string;
echo   featured: boolean;
echo   createdAt: Date;
echo   updatedAt: Date;
echo   aiDescription?: string; // AI-generated description
echo   pros: string[];
echo   cons: string[];
echo   rating?: number; // 1-5
echo   reviewCount?: number;
echo }
echo 
echo // Collection reference
echo const productsCollection = collection(db, 'affiliateProducts');
echo 
echo export const affiliateModel = {
echo   // Get all products
echo   async getAllProducts(limitCount: number = 50): Promise<AffiliateProduct[]> {
echo     try {
echo       const q = query(
echo         productsCollection,
echo         orderBy('createdAt', 'desc'),
echo         limit(limitCount)
echo       );
echo       
echo       const querySnapshot = await getDocs(q);
echo       return querySnapshot.docs.map(doc => ({
echo         id: doc.id,
echo         ...doc.data(),
echo         createdAt: doc.data().createdAt?.toDate() || new Date(),
echo         updatedAt: doc.data().updatedAt?.toDate() || new Date(),
echo       })) as AffiliateProduct[];
echo     } catch (error) {
echo       console.error('Error getting products:', error);
echo       return [];
echo     }
echo   },
echo 
echo   // Get products by category
echo   async getProductsByCategory(category: string): Promise<AffiliateProduct[]> {
echo     try {
echo       const q = query(
echo         productsCollection,
echo         where('category', '==', category),
echo         orderBy('createdAt', 'desc')
echo       );
echo       
echo       const querySnapshot = await getDocs(q);
echo       return querySnapshot.docs.map(doc => ({
echo         id: doc.id,
echo         ...doc.data(),
echo         createdAt: doc.data().createdAt?.toDate() || new Date(),
echo         updatedAt: doc.data().updatedAt?.toDate() || new Date(),
echo       })) as AffiliateProduct[];
echo     } catch (error) {
echo       console.error('Error getting products by category:', error);
echo       return [];
echo     }
echo   },
echo 
echo   // Get featured products
echo   async getFeaturedProducts(limitCount: number = 6): Promise<AffiliateProduct[]> {
echo     try {
echo       const q = query(
echo         productsCollection,
echo         where('featured', '==', true),
echo         orderBy('createdAt', 'desc'),
echo         limit(limitCount)
echo       );
echo       
echo       const querySnapshot = await getDocs(q);
echo       return querySnapshot.docs.map(doc => ({
echo         id: doc.id,
echo         ...doc.data(),
echo         createdAt: doc.data().createdAt?.toDate() || new Date(),
echo         updatedAt: doc.data().updatedAt?.toDate() || new Date(),
echo       })) as AffiliateProduct[];
echo     } catch (error) {
echo       console.error('Error getting featured products:', error);
echo       return [];
echo     }
echo   },
echo 
echo   // Add new product
echo   async addProduct(product: Omit<AffiliateProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
echo     try {
echo       const productWithTimestamps = {
echo         ...product,
echo         createdAt: Timestamp.now(),
echo         updatedAt: Timestamp.now(),
echo       };
echo       
echo       const docRef = await addDoc(productsCollection, productWithTimestamps);
echo       return docRef.id;
echo     } catch (error) {
echo       console.error('Error adding product:', error);
echo       throw error;
echo     }
echo   },
echo 
echo   // Update product
echo   async updateProduct(id: string, updates: Partial<AffiliateProduct>): Promise<boolean> {
echo     try {
echo       const docRef = doc(db, 'affiliateProducts', id);
echo       const updateData = {
echo         ...updates,
echo         updatedAt: Timestamp.now(),
echo       };
echo       
echo       await updateDoc(docRef, updateData);
echo       return true;
echo     } catch (error) {
echo       console.error('Error updating product:', error);
echo       return false;
echo     }
echo   },
echo };
) > src\models\affiliate.ts

echo.
echo 📝 Updating .env with Firebase configuration...
if not exist .env (
  (
  echo # Firebase Configuration
  echo NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
  echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
  echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
  echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
  echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
  echo NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
  echo NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
  echo 
  echo # OpenAI for AI content generation
  echo OPENAI_API_KEY=your-openai-key-here
  echo 
  echo # App Configuration
  echo NODE_ENV=development
  ) > .env
) else (
  echo # Adding Firebase config to existing .env...
  echo # Firebase Configuration >> .env
  echo NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here >> .env
  echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com >> .env
  echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id >> .env
  echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com >> .env
  echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id >> .env
  echo NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id >> .env
  echo NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id >> .env
)

echo.
echo 📝 Updating automation script to use Firebase...
if exist scripts\automate.ts (
  echo Creating backup of original automation script...
  copy scripts\automate.ts scripts\automate.ts.backup
  
  echo Updating automation script to use Firebase...
  (
  echo // Updated automation script - Using Firebase instead of Mongoose
  echo import 'dotenv/config';
  echo import { initializeApp } from 'firebase/app';
  echo import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
  echo import { OpenAI } from 'openai';
  echo import { postModel } from '@/models/post';
  echo import { affiliateModel } from '@/models/affiliate';
  echo 
  echo // Firebase configuration
  echo const firebaseConfig = {
  echo   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  echo   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  echo   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  echo   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  echo   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  echo   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  echo   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  echo };
  echo 
  echo // Initialize Firebase
  echo const app = initializeApp(firebaseConfig);
  echo const db = getFirestore(app);
  echo 
  echo // Initialize OpenAI
  echo const openai = new OpenAI({
  echo   apiKey: process.env.OPENAI_API_KEY,
  echo });
  echo 
  echo console.log('🤖 Starting AI Affiliate Blog Automation with Firebase...');
  echo 
  echo async function generateBlogPost(topic: string) {
  echo   console.log(\`📝 Generating blog post about: \${topic}\`);
  echo   
  echo   try {
  echo     const response = await openai.chat.completions.create({
  echo       model: 'gpt-4-turbo-preview',
  echo       messages: [
  echo         {
  echo           role: 'system',
  echo           content: \`You are a professional affiliate blogger specializing in \${topic}. 
  echo           Write engaging, SEO-optimized content with natural affiliate link placements.
  echo           Include an introduction, 3-5 main sections with headings, and a conclusion.\`,
  echo         },
  echo         {
  echo           role: 'user',
  echo           content: \`Write a comprehensive 1500-word blog post about \${topic} 
  echo           that includes recommendations for products with affiliate opportunities.\`,
  echo         },
  echo       ],
  echo       max_tokens: 2000,
  echo       temperature: 0.7,
  echo     });
  echo 
  echo     const content = response.choices[0]?.message?.content;
  echo     
  echo     if (!content) {
  echo       throw new Error('Failed to generate content');
  echo     }
  echo 
  echo     // Extract title from content (first line)
  echo     const title = content.split('\n')[0].replace('#', '').trim() || \`Best \${topic} Guide\`;
  echo     
  echo     // Create slug from title
  echo     const slug = title
  echo       .toLowerCase()
  echo       .replace(/[^\w\s]/g, '')
  echo       .replace(/\s+/g, '-');
  echo 
  echo     // Create excerpt (first 150 characters)
  echo     const excerpt = content.substring(0, 150) + '...';
  echo 
  echo     const post = {
  echo       title,
  echo       slug,
  echo       content,
  echo       excerpt,
  echo       category: topic.split(' ')[0].toLowerCase(),
  echo       tags: [topic, 'review', 'guide'],
  echo       published: false, // Draft mode
  echo       author: 'AI Assistant',
  echo       aiGenerated: true,
  echo       wordCount: content.split(' ').length,
  echo       readingTime: Math.ceil(content.split(' ').length / 200), // 200 wpm
  echo       affiliateLinks: [
  echo         {
  echo           product: \`Top \${topic} Product\`,
  echo           url: 'https://example.com/affiliate-link',
  echo           price: 99.99,
  echo           commission: 10,
  echo         },
  echo       ],
  echo       seo: {
  echo         title: \`Best \${topic} - Complete Guide & Reviews\`,
  echo         description: excerpt,
  echo         keywords: [topic, 'review', 'buying guide', 'best products'],
  echo       },
  echo     };
  echo 
  echo     // Save to Firebase
  echo     const savedPost = await postModel.createPost(post);
  echo     console.log(\`✅ Blog post saved to Firebase! ID: \${savedPost.id}\`);
  echo     console.log(\`📖 Title: \${savedPost.title}\`);
  echo     
  echo     return savedPost;
  echo   } catch (error) {
  echo     console.error('❌ Error generating blog post:', error);
  echo     throw error;
  echo   }
  echo }
  echo 
  echo async function generateAffiliateProducts(category: string) {
  echo   console.log(\`🛍️ Generating affiliate products for category: \${category}\`);
  echo   
  echo   try {
  echo     const response = await openai.chat.completions.create({
  echo       model: 'gpt-4-turbo-preview',
  echo       messages: [
  echo         {
  echo           role: 'system',
  echo           content: 'You are an e-commerce expert. Generate realistic product descriptions for affiliate marketing.',
  echo         },
  echo         {
  echo           role: 'user',
  echo           content: \`Generate 3 realistic \${category} products with prices, descriptions, pros, and cons for affiliate marketing.\`,
  echo         },
  echo       ],
  echo       max_tokens: 1000,
  echo     });
  echo 
  echo     const content = response.choices[0]?.message?.content;
  echo     
  echo     if (!content) {
  echo       throw new Error('Failed to generate products');
  echo     }
  echo 
  echo     // Parse the generated content (simplified - in reality you'd parse better)
  echo     const products = [
  echo       {
  echo         name: \`Premium \${category} Product 1\`,
  echo         description: \`High-quality \${category} with excellent features.\`,
  echo         price: 129.99,
  echo         originalPrice: 159.99,
  echo         affiliateLink: 'https://example.com/affiliate/product1',
  echo         commission: 8.5,
  echo         category,
  echo         tags: [category, 'premium', 'bestseller'],
  echo         imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  echo         featured: true,
  echo         pros: ['High quality', 'Durable', 'Great value'],
  echo         cons: ['Premium price', 'Limited availability'],
  echo         rating: 4.5,
  echo         reviewCount: 128,
  echo         aiDescription: content.split('\n')[0],
  echo       },
  echo       // Add more products as needed
  echo     ];
  echo 
  echo     // Save products to Firebase
  echo     for (const product of products) {
  echo       const productId = await affiliateModel.addProduct(product);
  echo       console.log(\`✅ Product saved: \${product.name} (ID: \${productId})\`);
  echo     }
  echo     
  echo     return products.length;
  echo   } catch (error) {
  echo     console.error('❌ Error generating products:', error);
  echo     throw error;
  echo   }
  echo }
  echo 
  echo async function main() {
  echo   console.log('🚀 Starting automation tasks...');
  echo   
  echo   try {
  echo     // Example topics for your affiliate blog
  echo     const topics = [
  echo       'gaming laptops',
  echo       'wireless headphones',
  echo       'fitness trackers',
  echo       'coffee makers',
  echo       'yoga mats',
  echo     ];
  echo 
  echo     // Generate content for each topic
  echo     for (const topic of topics.slice(0, 2)) { // Start with 2 topics
  echo       console.log(\`\\n🎯 Processing topic: \${topic}\`);
  echo       
  echo       // Generate blog post
  echo       await generateBlogPost(topic);
  echo       
  echo       // Generate affiliate products
  echo       await generateAffiliateProducts(topic);
  echo       
  echo       console.log(\`✅ Completed topic: \${topic}\`);
  echo     }
  echo 
  echo     console.log('\\n🎉 Automation completed successfully!');
  echo     console.log('📊 Next steps:');
  echo     console.log('1. Review generated posts in Firebase console');
  echo     console.log('2. Add real affiliate links');
  echo     console.log('3. Publish posts from admin panel');
  echo     console.log('4. Run automation daily/weekly for fresh content');
  echo     
  echo   } catch (error) {
  echo     console.error('❌ Automation failed:', error);
  echo     process.exit(1);
  echo   }
  echo }
  echo 
  echo // Run the automation
  echo main().catch(console.error);
  ) > scripts\automate.ts
)

echo.
echo 📝 Updating Next.js configuration for Firebase...
(
echo /** @type {import('next').NextConfig} */
echo const nextConfig = {
echo   reactStrictMode: true,
echo   // Firebase works with both webpack and edge
echo   experimental: {
echo     turbo: undefined, // Use webpack for compatibility
echo   },
echo   // Images from Firebase Storage
echo   images: {
echo     remotePatterns: [
echo       {
echo         protocol: 'https',
echo         hostname: 'firebasestorage.googleapis.com',
echo       },
echo       {
echo         protocol: 'https',
echo         hostname: '**.googleusercontent.com',
echo       },
echo       {
echo         protocol: 'https',
echo         hostname: 'images.unsplash.com',
echo       },
echo     ],
echo   },
echo };
echo 
echo export default nextConfig;
) > next.config.js

echo.
echo 🔧 Creating setup instructions...
(
echo # 🚀 Firebase Setup Instructions
echo #
echo # 1. Create a Firebase Project:
echo #    - Go to https://console.firebase.google.com/
echo #    - Click "Add project"
echo #    - Name it "ai-affiliate-blog"
echo #    - Disable Google Analytics (optional)
echo #
echo # 2. Enable Firestore Database:
echo #    - In Firebase console, go to "Firestore Database"
echo #    - Click "Create database"
echo #    - Start in test mode (for development)
echo #    - Choose a location close to you
echo #
echo # 3. Get Firebase Configuration:
echo #    - Click the gear icon ⚙️ > Project settings
echo #    - Scroll to "Your apps" section
echo #    - Click "Web" app (or create one)
echo #    - Name it "AI Affiliate Blog"
echo #    - Copy the configuration object
echo #
echo # 4. Update .env file:
echo #    Replace the placeholder values in .env with your actual Firebase config
echo #
echo # 5. Test the setup:
echo #    - Run: npm run build
echo #    - Run: npm run automate
echo #
echo # 💡 Free Tier Limits:
echo #    - 1GB Firestore storage
echo #    - 20K writes/day
echo #    - 50K reads/day
echo #    - 20K deletes/day
echo #    - More than enough for a blog!
echo #
) > FIREBASE_SETUP.md

echo.
echo ✅ Firebase setup complete! 
echo.
echo 📋 NEXT STEPS:
echo 1. Go to https://console.firebase.google.com/
echo 2. Create a new Firebase project
echo 3. Enable Firestore Database
echo 4. Copy your Firebase config to .env file
echo 5. Run: npm run build
echo 6. Run: npm run automate
echo.
echo 🔥 Firebase is FREE for small projects!
pause