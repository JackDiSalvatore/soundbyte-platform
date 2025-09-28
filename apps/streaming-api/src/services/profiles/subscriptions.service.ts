import { eq } from 'drizzle-orm';
import { db } from '../../db/db';
import {
  planEnum,
  subscriptions,
} from '../../db/schema/soundbyte-profiles-schema';
import { Injectable } from '@nestjs/common';

export type CreateSubscriptionDto = {
  profileId: number;
  plan: (typeof planEnum.enumValues)[number];
  expiresAt?: Date;
};

@Injectable()
export class SubscriptionsService {
  async create(dto: CreateSubscriptionDto) {
    const [sub] = await db.insert(subscriptions).values(dto).returning();
    return sub;
  }

  async update(id: number, dto: Partial<CreateSubscriptionDto>) {
    const [sub] = await db
      .update(subscriptions)
      .set({
        ...(dto.plan && { plan: dto.plan }),
        ...(dto.expiresAt && { expiresAt: dto.expiresAt }),
      })
      .where(eq(subscriptions.id, id))
      .returning();
    return sub;
  }

  async remove(id: number) {
    const [sub] = await db
      .delete(subscriptions)
      .where(eq(subscriptions.id, id))
      .returning();
    return sub;
  }
}
