import { db } from '../../db/db';
import {
  genres,
  profileGenres,
} from '../../db/schema/soundbyte-profiles-schema';
import { eq, and } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenresService {
  async listAll() {
    const allGenres = await db.select().from(genres);
    return allGenres;
  }

  async create(name: string) {
    const [genre] = await db.insert(genres).values({ name }).returning();
    return genre;
  }

  async remove(id: number) {
    const [genre] = await db
      .delete(genres)
      .where(eq(genres.id, id))
      .returning();
    return genre;
  }

  async addToProfile(profileId: number, genreId: number) {
    const [link] = await db
      .insert(profileGenres)
      .values({ profileId, genreId })
      .onConflictDoNothing()
      .returning();
    return link;
  }

  async removeFromProfile(profileId: number, genreId: number) {
    const [deleted] = await db
      .delete(profileGenres)
      .where(
        and(
          eq(profileGenres.profileId, profileId),
          eq(profileGenres.genreId, genreId),
        ),
      )
      .returning();
    return deleted;
  }
}
