import dotenv from 'dotenv';
dotenv.config();

type Env = {
  PORT: number;
  DATABASE_URL: string;
  FRONTEND_BASE_URL: string;
  SPOTIFY_REDIRECT_URL: string;
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
};

export const env: Env = {
  PORT: Number(process.env.PORT) ?? 3002,
  DATABASE_URL: process.env.DATABASE_URL!,
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL!,
  SPOTIFY_REDIRECT_URL: process.env.SPOTIFY_REDIRECT_URL!,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID!,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET!,
};
