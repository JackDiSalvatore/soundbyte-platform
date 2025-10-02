import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  serial,
  unique,
  boolean,
  integer,
} from 'drizzle-orm/pg-core';

// ----------------------
// Enums
// ----------------------
export const planEnum = pgEnum('plan', ['free', 'pro']);
export const platformEnum = pgEnum('platform', [
  'instagram',
  'twitter',
  'facebook',
  'tiktok',
  'spotify',
  'bandcamp',
  'youtube',
]);

// ----------------------
// Profiles
// ----------------------
export const profiles = pgTable(
  'profiles',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    providerId: text('provider_id').notNull(),
    email: text('email').notNull(),
    verified: boolean('verified').default(false).notNull(),
    public: boolean('public').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    userIdUnique: unique().on(t.userId),
    providerIdUnique: unique().on(t.providerId),
  }),
);

// ----------------------
// Genres
// ----------------------
export const genres = pgTable(
  'genres',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
  },
  (t) => ({
    nameUnique: unique().on(t.name),
  }),
);

export const profileGenres = pgTable(
  'profile_genres',
  {
    profileId: integer('profile_id')
      .references(() => profiles.id)
      .notNull(),
    genreId: integer('genre_id')
      .references(() => genres.id)
      .notNull(),
  },
  (t) => ({
    pk: unique().on(t.profileId, t.genreId),
  }),
);

// ----------------------
// Subscriptions
// ----------------------
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' })
    .unique(), // ✅ only one subscription per profile
  plan: planEnum('plan').notNull().default('free'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
});

// ----------------------
// Social Links
// ----------------------
export const socialLinks = pgTable(
  'social_links',
  {
    id: serial('id').primaryKey(),
    profileId: integer('profile_id')
      .references(() => profiles.id)
      .notNull(),
    platform: platformEnum('platform').notNull(),
    url: text('url').notNull(),
  },
  (t) => ({
    uniqueProfilePlatform: unique().on(t.profileId, t.platform),
  }),
);
