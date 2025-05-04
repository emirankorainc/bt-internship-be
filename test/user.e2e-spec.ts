import * as request from 'supertest';
import { app, setupE2ETest, teardownE2ETest } from './e2e-setup';

describe('User (e2e)', () => {
  let cookies: string;

  beforeAll(async () => {
    await setupE2ETest();
  }, 10000);

  afterAll(async () => {
    await teardownE2ETest();
  });

  it('should register and get auth cookie', async () => {
    const registerDto = {
      email: 'test@example.com',
      password: '123ABcd.',
      confirmPassword: '123ABcd.',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+38761234567',
      dateOfBirth: new Date('2000-01-02T00:00:00.000Z'),
    };

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201);

    cookies = res.headers['set-cookie'][0];
    expect(cookies).toBeDefined();
    expect(cookies).toContain('access_token=');
  });

  it('should return 401 if user is not authenticated', async () => {
    await request(app.getHttpServer()).get('/user/current-user').expect(401);
  });

  it('should return current user with valid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/current-user')
      .set('Cookie', cookies)
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
      .set('Cookie', 'access_token=invalid.token')
      .expect(401);
  });

  it('should return 403 forbidden access for user role', async () => {
    await request(app.getHttpServer())
      .get('/user')
      .set('Cookie', cookies)
      .expect(403);
  });
});
