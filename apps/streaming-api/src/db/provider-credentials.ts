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
      accessToken: credentials.token.access_token, // TODO: encrypt this
      refreshToken: credentials.token.refresh_token, // TODO: encrypt this
      scope: credentials.token.scope,
      tokenType: credentials.token.token_type,
      expiresIn: credentials.token.expires_in,
    })
    .onConflictDoUpdate({
      target: [credentialsTable.userId, credentialsTable.provider],
      set: {
        accessToken: credentials.token.access_token,
        refreshToken: credentials.token.refresh_token,
        scope: credentials.token.scope,
        tokenType: credentials.token.token_type,
        expiresAt: new Date(Date.now() + credentials.token.expires_in * 1000),
        expiresIn: credentials.token.expires_in,
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
