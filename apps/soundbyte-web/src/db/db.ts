import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL as string,
});

export const db = drizzle({ client: pool });
