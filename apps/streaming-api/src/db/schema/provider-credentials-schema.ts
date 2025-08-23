import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  unique,
} from 'drizzle-orm/pg-core';

export const credentialsTable = pgTable(
  'credentials',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    provider: text('provider').notNull(), // spotify, soundcloud
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token').notNull(),
    scope: text('scope').notNull(),
    tokenType: text('token_type').notNull(),
    expiresIn: integer('expires_in').notNull(),
    expiresAt: timestamp('expires_at')
      .$defaultFn(() => new Date(Date.now() + 3600 * 1000)) // Spotify Expires after 60 mins
      .notNull(),
    createdAt: timestamp('created_at')
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp('updated_at')
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (t) => ({
    userProviderUnique: unique().on(t.userId, t.provider),
  }),
);
