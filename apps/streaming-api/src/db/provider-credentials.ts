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
}) {
  const [res] = await db
    .select()
    .from(credentialsTable)
    .where(
      and(
        eq(credentialsTable.provider, provider),
        eq(credentialsTable.userId, userId),
      ),
    );

  return res;
}

export async function insertCredentials(
  credentials: CreateProviderCredentialsDto,
) {
  const newCredentials = await db
    .insert(credentialsTable)
    .values({
      userId: credentials.userId,
      provider: credentials.provider,
      accessToken: credentials.token.access_token,
      refreshToken: credentials.token.refresh_token,
      scope: credentials.token.scope,
      tokenType: credentials.token.token_type,
      expiresIn: credentials.token.expires_in,
    })
    .returning();

  console.log('Inserted user credentials:', newCredentials);
}
