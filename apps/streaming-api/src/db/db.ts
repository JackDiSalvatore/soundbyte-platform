import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config();

const configService = new ConfigService();

const pool = new Pool({
  connectionString: configService.get<string>('DATABASE_URL'),
});

export const db = drizzle({ client: pool });
