import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, 'seed_user_profiles_100.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const profiles = JSON.parse(rawData);

  for (const data of profiles) {
    try {
      await prisma.userProfile.create({
        data: {
          userId: data.userId,
          recordedAt: new Date(data.recordedAt),
          age: data.age ?? null,
          gender: data.gender ?? null,
          travelType: data.travelType ?? null,
          interests: data.interests ?? [],
          budgetLevel: data.budgetLevel ?? null,
          preferredSeason: data.preferredSeason ?? null,
          ecoFriendly: data.ecoFriendly ?? null,
          country: data.country ?? null,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error(`❌ Error inserting user profile [userId: ${data.userId}]:`, err.message);
      } else {
        console.error(`❌ Unknown error:`, err);
      }
    }
  }

  console.log('✅ UserProfile 100개 업로드 완료');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
