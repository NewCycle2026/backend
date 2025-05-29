// src/scripts/seed-cash-rest.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'user3@example.com',
      password: 'hashed_pw3',
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: user.password,
        userProfiles: {
          create: {}, // ✅ 최소 생성
        },
      },
    });
  }
}

main()
  .then(() => {
    console.log('✅ seed-users.ts 실행 완료');
  })
  .catch((e) => {
    console.error('❌ Seed error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
