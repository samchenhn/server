import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // 设置全局前缀，与主应用保持一致
    app.setGlobalPrefix('server');
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('认证相关测试', () => {
    it('POST /server/auth/login - 登录成功', async () => {
      const response = await request(app.getHttpServer())
        .post('/server/auth/login')
        .send({
          username: 'samchen',
          password: '123456',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('tokenType', 'Bearer');
      expect(response.body).toHaveProperty('expiresIn', 3600);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('username', 'samchen');

      // 保存token供后续测试使用
      accessToken = response.body.accessToken;
    });

    it('POST /server/auth/login - 登录失败', async () => {
      await request(app.getHttpServer())
        .post('/server/auth/login')
        .send({
          username: 'wronguser',
          password: 'wrongpass',
        })
        .expect(401);
    });
  });

  describe('受保护的路由测试', () => {
    beforeEach(async () => {
      // 先登录获取token
      const response = await request(app.getHttpServer())
        .post('/server/auth/login')
        .send({
          username: 'samchen',
          password: '123456',
        });
      accessToken = response.body.accessToken;
    });

    it('GET /server - 带token的根路径访问', async () => {
      await request(app.getHttpServer())
        .get('/server')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect('Hello World!');
    });

    it('GET /server/auth/profile - 获取用户信息', async () => {
      const response = await request(app.getHttpServer())
        .get('/server/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('username', 'samchen');
      expect(response.body).toHaveProperty('name', '陈辉');
      expect(response.body).toHaveProperty('email', 'samchen@sinabuddy.com');
    });

    it('POST /server/auth/logout - 登出', async () => {
      const response = await request(app.getHttpServer())
        .post('/server/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        '登出成功，请在客户端清除令牌',
      );
    });

    it('GET /server/users - 获取用户列表', async () => {
      const response = await request(app.getHttpServer())
        .get('/server/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('未认证访问测试', () => {
    it('GET /server - 未认证访问根路径', async () => {
      await request(app.getHttpServer()).get('/server').expect(401);
    });

    it('GET /server/auth/profile - 未认证访问用户信息', async () => {
      await request(app.getHttpServer())
        .get('/server/auth/profile')
        .expect(401);
    });

    it('GET /server/users - 未认证访问用户列表', async () => {
      await request(app.getHttpServer()).get('/server/users').expect(401);
    });
  });
});
