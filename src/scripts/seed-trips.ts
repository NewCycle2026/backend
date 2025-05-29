// src/scripts/seed-trips.ts
// src/scripts/seed-trips.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, 'seed_trips_20.json'); // ✅ 파일명 수정
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const trips = JSON.parse(rawData);

  for (const data of trips) {
    try {
      // 유효성 체크
      if (
        !data.userId ||
        !data.title ||
        !data.countryCode ||
        !data.startDate ||
        !data.endDate ||
        isNaN(Date.parse(data.startDate)) ||
        isNaN(Date.parse(data.endDate))
      ) {
        console.warn(`⚠️  Skipped invalid trip data:`, data);
        continue;
      }

      await prisma.trip.create({
        data: {
          userId: data.userId,
          userProfileId: data.userProfileId ?? null,
          profileHistoryId: data.profileHistoryId ?? null,
          title: data.title,
          countryCode: data.countryCode,
          distanceKm: data.distanceKm ?? null,
          publicTransport: data.publicTransport ?? false,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          createdAt: new Date(data.createdAt ?? Date.now()),
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error(`❌ Error inserting trip:`, err.message);
      } else {
        console.error(`❌ Unknown error:`, err);
      }
    }
  }

  console.log('✅ Trip 20개 DB 업로드 완료');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

