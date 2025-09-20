import { CreateProviderCredentialsDto } from '../dto/create-provider-credential.dto';
import { db } from './db';
import { credentialsTable } from './schema/provider-credentials-schema';
import { and, eq } from 'drizzle-orm';

export async function getCredentials({
  userId,
  provider,
}: {
  userId: string;
  provider: string;
}): Promise<typeof credentialsTable.$inferSelect | undefined> {
  console.log('Searching for: ', userId, provider);

  const [res] = await db
    .select()
    .from(credentialsTable)
    .where(
      and(
        eq(credentialsTable.provider, provider),
        eq(credentialsTable.userId, userId),
      ),
    );

  console.log('Get credentials for:', res);

  return res;
}

export async function upsertCredentials(
  credentials: CreateProviderCredentialsDto,
): Promise<void> {
  await db
    .insert(credentialsTable)
    .values({
      userId: credentials.userId,
      provider: credentials.provider,
      accessToken: credentials.accessToken, // TODO: encrypt this
      refreshToken: credentials.refreshToken, // TODO: encrypt this
      scope: credentials.scope,
      tokenType: credentials.tokenType,
      expiresIn: credentials.expiresIn,
    })
    .onConflictDoUpdate({
      target: [credentialsTable.userId, credentialsTable.provider],
      set: {
        accessToken: credentials.accessToken,
        refreshToken: credentials.refreshToken,
        scope: credentials.scope,
        tokenType: credentials.tokenType,
        expiresAt: new Date(Date.now() + credentials.expiresIn * 1000),
        expiresIn: credentials.expiresIn,
      },
    });

  console.log(
    'Upserted user credentials for:',
    credentials.userId,
    credentials.provider,
  );
}

export async function deleteCredentials({
  userId,
  provider,
}: {
  userId: string;
  provider: string;
}): Promise<void> {
  await db
    .delete(credentialsTable)
    .where(
      and(
        eq(credentialsTable.userId, userId),
        eq(credentialsTable.provider, provider),
      ),
    );

  console.log('Deleted credentials for:', userId, provider);
}
