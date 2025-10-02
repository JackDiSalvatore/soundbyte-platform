import { db } from '../../db/db';
import {
  genres,
  profileGenres,
  profiles,
  socialLinks,
  subscriptions,
} from '../../db/schema/soundbyte-profiles-schema';
import { eq } from 'drizzle-orm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { SubscriptionsService } from './subscriptions.service';
import { GenresService } from './genres.service';
import { SocialLinksService } from './social-links.service';
import { CreateProfileDto } from '../../dto/profiles/create-profile.dto';
import { UpdateProfileDto } from '../../dto/profiles/update-profile.dto';
import { UpsertSubscriptionDto } from '../../dto/profiles/upsert-subscription.dto';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly genresService: GenresService,
    private readonly socialLinksService: SocialLinksService,
  ) {}

  async findByUserId(userId: string) {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));

    if (!profile) {
      throw new NotFoundException(`Profile with userId "${userId}" not found`);
    }
    return profile;
  }

  async findByProviderId(providerId: string) {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.providerId, providerId));

    if (!profile) {
      throw new NotFoundException(
        `Profile with providerId "${providerId}" not found`,
      );
    }
    return profile;
  }

  async createWithRelations(dto: {
    profile: CreateProfileDto;
    subscription?: {
      plan: 'free' | 'pro';
      expiresAt?: Date;
    };
    genres?: number[];
    socials?: { platform: string; url: string }[];
  }) {
    console.log('Profile DTO after transform:', dto);

    // 1. Create profile
    const [profile] = await db
      .insert(profiles)
      .values({
        userId: dto.profile.user_id,
        providerId: dto.profile.provider_id,
        email: dto.profile.email,
        verified: dto.profile.verified ?? false,
        public: dto.profile.public ?? true,
      })
      .returning();

    // 2. Optional subscription
    if (dto.subscription) {
      await this.subscriptionsService.create({
        ...dto.subscription,
        profileId: profile.id,
      });
    }

    // 3. Optional genres
    if (dto.genres?.length) {
      for (const genreId of dto.genres) {
        await this.genresService.addToProfile(profile.id, genreId);
      }
    }

    // 4. Optional social links
    if (dto.socials?.length) {
      for (const social of dto.socials) {
        if (
          ![
            'facebook',
            'twitter',
            'tiktok',
            'instagram',
            'youtube',
            'bandcamp',
          ].includes(social.platform)
        )
          throw new Error('invalid social link');

        await this.socialLinksService.create({
          platform: social.platform as
            | 'facebook'
            | 'twitter'
            | 'tiktok'
            | 'instagram'
            | 'youtube'
            | 'bandcamp',
          url: social.url,
          profile_id: profile.id,
        });
      }
    }

    return profile;
  }

  async update(id: number, dto: UpdateProfileDto) {
    const [profile] = await db
      .update(profiles)
      .set({
        ...(dto.email && { email: dto.email }),
        ...(dto.verified !== undefined && { verified: dto.verified }),
        ...(dto.public !== undefined && { public: dto.public }),
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, id))
      .returning();
    return profile;
  }

  async remove(id: number) {
    // Delete related genres
    await db.delete(profileGenres).where(eq(profileGenres.profileId, id));

    // Delete related social links
    await db.delete(socialLinks).where(eq(socialLinks.profileId, id));

    // delete the profile
    const [profile] = await db
      .delete(profiles)
      .where(eq(profiles.id, id))
      .returning();
    return profile;
  }

  private async getProfileIdByUserId(userId: string): Promise<number> {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId));

    if (!profile) {
      throw new NotFoundException(`Profile with userId "${userId}" not found`);
    }

    return profile.id;
  }

  /** ---------------- Genres ---------------- */

  async findGenresByUserId(userId: string) {
    const profileId = await this.getProfileIdByUserId(userId);

    return db
      .select({ id: genres.id, name: genres.name })
      .from(profileGenres)
      .innerJoin(genres, eq(profileGenres.genreId, genres.id))
      .where(eq(profileGenres.profileId, profileId));
  }

  async updateGenres(userId: string, genreIds: number[]) {
    const profileId = await this.getProfileIdByUserId(userId);

    // 1. Remove existing genres
    await db
      .delete(profileGenres)
      .where(eq(profileGenres.profileId, profileId));

    // 2. Insert new genres (type-safe)
    if (genreIds.length > 0) {
      await db.insert(profileGenres).values(
        genreIds.map(
          (gid) =>
            ({
              profileId,
              genreId: gid,
            }) satisfies typeof profileGenres.$inferInsert,
        ),
      );
    }

    return this.findGenresByUserId(userId);
  }

  /** ---------------- Social Links ---------------- */

  async findSocialLinksByUserId(userId: string) {
    const profileId = await this.getProfileIdByUserId(userId);

    return db
      .select()
      .from(socialLinks)
      .where(eq(socialLinks.profileId, profileId));
  }

  async updateSocialLinks(
    userId: string,
    links: Record<string, string | null>,
  ) {
    const profileId = await this.getProfileIdByUserId(userId);

    // First, delete old links
    await db.delete(socialLinks).where(eq(socialLinks.profileId, profileId));

    // Then, insert new links (only non-null values)
    const rows = Object.entries(links)
      .filter(([, url]) => url) // skip nulls
      .map(
        ([platform, url]) =>
          ({
            profileId,
            platform: platform as (typeof socialLinks.$inferInsert)['platform'],
            url: url as string,
          }) satisfies typeof socialLinks.$inferInsert,
      );

    if (rows.length > 0) {
      await db.insert(socialLinks).values(rows);
    }

    return this.findSocialLinksByUserId(userId);
  }

  /** ---------------- Subscriptions ---------------- */

  async findSubscriptionByUserId(userId: string) {
    const profileId = await this.getProfileIdByUserId(userId);

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.profileId, profileId));

    return subscription ?? null;
  }

  async upsertSubscription(userId: string, data: UpsertSubscriptionDto) {
    const profileId = await this.getProfileIdByUserId(userId);

    const [existing] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.profileId, profileId));

    if (existing) {
      await db
        .update(subscriptions)
        .set(data)
        .where(eq(subscriptions.profileId, profileId));
    } else {
      await db.insert(subscriptions).values({
        profileId,
        ...data,
      } satisfies typeof subscriptions.$inferInsert);
    }

    return this.findSubscriptionByUserId(userId);
  }

  async updateSubscription(userId: string, data: UpsertSubscriptionDto) {
    const profileId = await this.getProfileIdByUserId(userId);

    const [existing] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.profileId, profileId));

    if (existing) {
      await db
        .update(subscriptions)
        .set(data)
        .where(eq(subscriptions.profileId, profileId));
    } else {
      await db.insert(subscriptions).values({
        profileId,
        ...data,
      } satisfies typeof subscriptions.$inferInsert);
    }

    return this.findSubscriptionByUserId(userId);
  }
}
