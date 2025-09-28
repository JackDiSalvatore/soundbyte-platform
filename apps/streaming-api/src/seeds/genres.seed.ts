import { db } from '../db/db';
import { genres } from '../db/schema/soundbyte-profiles-schema';

async function seedGenres() {
  const defaultGenres = [
    { name: 'Ambient' },
    { name: 'Classical' },
    { name: 'Country' },
    { name: 'Dance & EDM' },
    { name: 'Dancehall' },
    { name: 'Deep House' },
    { name: 'Disco' },
    { name: 'Drum & Bass' },
    { name: 'Dubstep' },
    { name: 'Electronic' },
    { name: 'Folk & Singer-Songwriter' },
    { name: 'House' },
    { name: 'Indie' },
    { name: 'Jazz' },
    { name: 'Blues' },
    { name: 'Latin' },
    { name: 'Metal' },
    { name: 'Piano' },
    { name: 'R&B & Soul' },
    { name: 'Reggaeton' },
    { name: 'Soundtrack' },
    { name: 'Techno' },
    { name: 'Trance' },
    { name: 'Trap' },
    { name: 'Triphop' },
    { name: 'World' },
    { name: 'Hip-Hop & Rap' },
    { name: 'Rock' },
    { name: 'Pop' },
    { name: 'Alternative Rock' },
    { name: 'Alternative' },
    { name: 'Instrumental' },
    { name: 'Electronic' },
  ];

  for (const g of defaultGenres) {
    try {
      await db.insert(genres).values(g).onConflictDoNothing();
    } catch (err) {
      console.error(`Skipping genre ${g.name}`, err);
    }
  }

  console.log('✅ Seeded genres');
}

seedGenres()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
