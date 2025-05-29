import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, 'seed_users_100.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const users = JSON.parse(rawData);

  for (const user of users) {
    try {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: user.password,
          //name: user.name,
          //nickname: user.nickname,
          role: user.role,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error(`❌ Error inserting user [id: ${user.id}]:`, err.message);
      } else {
        console.error(`❌ Unknown error:`, err);
      }
    }
  }

  console.log('✅ 사용자 100명 DB 업로드 완료');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
