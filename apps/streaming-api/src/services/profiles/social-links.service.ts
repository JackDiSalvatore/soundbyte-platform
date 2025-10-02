import { eq } from 'drizzle-orm';
import { db } from '../../db/db';
import { socialLinks } from '../../db/schema/soundbyte-profiles-schema';
import { Injectable } from '@nestjs/common';
import { CreateSocialLinkDto } from '../../dto/profiles/create-social-link.dto';

@Injectable()
export class SocialLinksService {
  async create(dto: CreateSocialLinkDto) {
    const [link] = await db
      .insert(socialLinks)
      .values({
        profileId: Number(dto.profile_id),
        platform: dto.platform,
        url: dto.url,
      })
      .returning();
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
