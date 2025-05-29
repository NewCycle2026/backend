// src/scripts/seed-companion-candidates.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, 'companion_matching_candidates_2000.json'); // ✅ 경로 고정
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(rawData);

  for (const item of data) {
    await prisma.companionMatchingCandidate.create({
      data: {
        tripId: item.tripId,
        candidateId: item.candidateId,
        matchScore: item.matchScore,
        status: item.status ?? 'suggested',
      },
    });
  }

  console.log(`✅ 총 ${data.length}개의 매칭 후보가 삽입되었습니다.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

