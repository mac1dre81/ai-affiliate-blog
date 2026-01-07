import mongoose from 'mongoose';

type DatabaseConfig = {
  uri: string;
  dbName?: string;
  connectTimeoutMS?: number;
  maxPoolSize?: number;
  retryWrites?: boolean;
  retryReads?: boolean;
};

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global type to include mongoose
declare global {
  var mongoose: MongooseCache | undefined;
}

const defaultOptions: Partial<DatabaseConfig> = {
  maxPoolSize: 10,
  connectTimeoutMS: 5000,
  retryWrites: true,
  retryReads: true,
};

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB(uri: string, options: Partial<DatabaseConfig> = {}) {
  if (!uri) {
    throw new Error('MongoDB connection string is required');
  }

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = { ...defaultOptions, ...options };
    
    mongoose.set('strictQuery', false);
    
    cached.promise = mongoose.connect(uri, {
      dbName: opts.dbName,
      connectTimeoutMS: opts.connectTimeoutMS,
      maxPoolSize: opts.maxPoolSize,
      retryWrites: opts.retryWrites,
      retryReads: opts.retryReads,
    } as mongoose.ConnectOptions);
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cached.promise = null;
    throw error;
  }
}

// Optional: Add graceful shutdown handler
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});