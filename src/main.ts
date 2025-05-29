// src/main.js
import { AppModule } from '@/app.module'; // alias 사용 예
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'module-alias/register'; // ★ alias 런타임 등록
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api'); // ✅ 이거 추가!
  // ✅ CORS 설정 추가 (프론트엔드 localhost:5173 허용)
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, // axios 요청이 withCredentials: true 일 때 필요
  });

  // 📁 정적 파일 서빙 (예: 업로드 이미지 접근 허용)
  app.useStaticAssets(join(__dirname, '..', 'uploads')); // 파일 업로드

  const config = new DocumentBuilder()
    .setTitle('Wayple API')
    .setDescription('API 명세서입니다')
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
  SwaggerModule.setup('api', app, document);

  const PORT = 3001;
  await app.listen(PORT);
  console.log(`🚀 Wayple API is running on http://localhost:${PORT}`);
}
bootstrap();
