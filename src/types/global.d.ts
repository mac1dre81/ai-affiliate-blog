import { Mongoose } from 'mongoose';

declare global {
  // Extend the global namespace to include mongoose cache
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      };
    }
  }
}

// This export is needed to make this file a module
export {};
