

import { AppModule } from '@/app.module'; // 메인 앱 모듈 경로 맞게 수정 필요
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';


describe('AdminAuthLoginController (e2e)', () => {
  let app: INestApplication;

  

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/admin-auth/login (POST) 성공 케이스', () => {
    return request(app.getHttpServer())
      .post('/admin-auth/login')
      .send({ email: 'admin@wayple.io', password: 'testpassword' }) // 테스트용 계정 정보
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
        expect(typeof res.body.accessToken).toBe('string');
      });
  });

  it('/admin-auth/login (POST) 실패 케이스 - 비밀번호 틀림', () => {
    return request(app.getHttpServer())
      .post('/admin-auth/login')
      .send({ email: 'admin@wayple.io', password: 'wrongpassword' })
      .expect(401);
  });
});
