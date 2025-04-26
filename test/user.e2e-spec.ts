import * as request from 'supertest';
import { app, setupE2ETest, teardownE2ETest } from './e2e-setup';

describe('User (e2e)', () => {
  let token: string;

  beforeAll(async () => {
    await setupE2ETest();

    const registerDto = {
      email: 'test@example.com',
      password: '123ABcd.',
      confirmPassword: '123ABcd.',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+38761234567',
      dateOfBirth: new Date('2000-01-02T00:00:00.000Z'),
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: registerDto.email, password: registerDto.password })
      .expect(200);

    token = loginRes.body.access_token;
  }, 10000);

  afterAll(async () => {
    await teardownE2ETest();
  })

  it('should return 401 if user is not authenticated', async () => {
    await request(app.getHttpServer())
      .get('/user/current-user')
      .expect(401);
  });

  it('should return current user with valid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/current-user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toMatchObject({
      id: expect.any(String),
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+38761234567',
      dateOfBirth: expect.stringContaining('2000-01-02'),
    });
  });

  it('should return 401 if token is invalid', async () => {
    await request(app.getHttpServer())
      .get('/user/current-user')
      .set('Authorization', 'Bearer invalid.token.here')
      .expect(401);
  });

});
