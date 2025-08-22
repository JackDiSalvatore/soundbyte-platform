import { pgTable, text, timestamp, serial, integer } from 'drizzle-orm/pg-core';

export const credentialsTable = pgTable('credentials', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  provider: text('provider').notNull(), // spotify, soundcloud
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  scope: text('scope').notNull(),
  tokenType: text('token_type').notNull(),
  expiresIn: integer('expires_in').notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
});
