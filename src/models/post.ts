import mongoose from 'mongoose';

export interface Post {
  id: string;
  title: string;
  content: string;
  published?: boolean;
  publishedAt?: Date;
  // ... other fields
}

// Create Mongoose schema if mongodb is configured
let PostModel: mongoose.Model<any> | null = null;

try {
  if (!mongoose.models.Post) {
    const postSchema = new mongoose.Schema<Post>({
      title: { type: String, required: true },
      content: { type: String, required: true },
      published: { type: Boolean, default: false },
      publishedAt: { type: Date, default: null },
    }, { timestamps: true });

    PostModel = mongoose.model<Post>('Post', postSchema);
  } else {
    PostModel = mongoose.models.Post;
  }
} catch (error) {
  // MongoDB not configured, PostModel remains null
  console.warn('Post model not initialized (MongoDB may not be configured)');
}

export default PostModel; 
