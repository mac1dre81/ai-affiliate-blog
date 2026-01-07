export type DatabaseConfig = {
  uri: string;
  timeout?: number;
  maxConnections?: number;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}