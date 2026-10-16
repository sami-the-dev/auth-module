import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { setupApp } from '../src/setup-app.js';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  const valid = { email: 'Jane@Example.com', name: 'Jane', password: 'secret123!' };

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongod.getUri();
    process.env.JWT_SECRET = 'test-secret-test-secret-test-secret-1234';
    const { AppModule } = await import('../src/app.module.js');
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    setupApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    await mongod?.stop();
  });

  it('rejects invalid sign up payloads', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({ email: 'nope', name: 'ab', password: 'short' });
    expect(res.status).toBe(400);
  });

  it('signs up, rejects duplicates, signs in, and serves /users/me', async () => {
    const http = request(app.getHttpServer());
    const up = await http.post('/api/auth/signup').send(valid);
    expect(up.status).toBe(201);
    expect(up.body.user.email).toBe('jane@example.com');
    expect(up.body.user.passwordHash).toBeUndefined();

    expect((await http.post('/api/auth/signup').send(valid)).status).toBe(409);
    expect((await http.post('/api/auth/signin').send({ email: valid.email, password: 'bad' })).status).toBe(401);

    const inRes = await http.post('/api/auth/signin').send({ email: valid.email, password: valid.password });
    expect(inRes.status).toBe(200);

    expect((await http.get('/api/users/me')).status).toBe(401);
    const me = await http.get('/api/users/me').set('Authorization', `Bearer ${inRes.body.accessToken}`);
    expect(me.status).toBe(200);
    expect(me.body.name).toBe('Jane');
  });
});
