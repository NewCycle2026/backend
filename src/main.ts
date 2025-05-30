// src/main.js
import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import 'module-alias/register';
import { join } from 'path';

const envFile = `.env.${process.env.NODE_ENV ?? 'development'}`;
dotenv.config({ path: envFile });
>>>>>>> 1ac5c1d (env setup)

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ 글로벌 prefix
  app.setGlobalPrefix('api');

  // ✅ 정적 파일 서빙 (예: /uploads/123.jpg)
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  // ✅ 환경 변수 기반 CORS 설정
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean); // 빈 값 제거

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS 차단됨: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // ✅ Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Wayple API')
    .setDescription('웨이플 API 명세서')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 로그인 상태 유지
    },
  });

  // ✅ 서버 포트
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  console.log(`🚀 Wayple API is running on http://localhost:${PORT}`);
}
bootstrap();
