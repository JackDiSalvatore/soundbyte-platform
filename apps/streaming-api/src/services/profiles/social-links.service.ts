import { eq } from 'drizzle-orm';
import { db } from '../../db/db';
import { socialLinks } from '../../db/schema/soundbyte-profiles-schema';
import type { platformEnum } from '../../db/schema/soundbyte-profiles-schema';
import { Injectable } from '@nestjs/common';

export type CreateSocialLinkDto = {
  profileId: number;
  platform: (typeof platformEnum.enumValues)[number];
  url: string;
};

@Injectable()
export class SocialLinksService {
  async create(dto: CreateSocialLinkDto) {
    const [link] = await db.insert(socialLinks).values(dto).returning();
    return link;
  }

  async update(id: number, url: string) {
    const [link] = await db
      .update(socialLinks)
      .set({ url })
      .where(eq(socialLinks.id, id))
      .returning();
    return link;
  }

  async remove(id: number) {
    const [link] = await db
      .delete(socialLinks)
      .where(eq(socialLinks.id, id))
      .returning();
    return link;
  }
}
