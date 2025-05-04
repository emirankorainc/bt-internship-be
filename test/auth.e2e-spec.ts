import * as request from 'supertest';
import { LoginDto, RegisterDto } from '../src/auth/dto';
import { app, setupE2ETest, teardownE2ETest } from './e2e-setup';

describe('Auth (e2e)', () => {
  let cookies: string;
  let clearedCookies: string;

  beforeAll(async () => {
    await setupE2ETest();
  }, 10000);

  afterAll(async () => {
    await teardownE2ETest();
  });

  const registerDto: RegisterDto = {
    email: 'test@gmail.com',
    password: '123ABcd.',
    confirmPassword: '123ABcd.',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+38761234567',
    dateOfBirth: new Date('2000-01-02T00:00:00.000Z'),
  };

  const loginDto: LoginDto = {
    email: 'test@gmail.com',
    password: '123ABcd.',
  };

  describe('Register', () => {
    it('should return 400 if email is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ password: registerDto.password })
        .expect(400);
    });
    it('should return 400 if password is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: registerDto.email })
        .expect(400);
    });
    it('should return 400 if no body is provided', async () => {
      await request(app.getHttpServer()).post('/auth/register').expect(400);
    });
    it('should register user and return 201', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);
    });
  });

  describe('Login', () => {
    it('should return 400 if email is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: loginDto.password })
        .expect(400);
    });
    it('should return 400 if password is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: loginDto.email })
        .expect(400);
    });
    it('should return 400 if no body is provided', async () => {
      await request(app.getHttpServer()).post('/auth/login').expect(400);
    });
    it('should login user and return 200', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      cookies = res.headers['set-cookie'][0];
    });
  });

  describe('Logout', () => {
    it('should return 401 if no cookie is provided', async () => {
      await request(app.getHttpServer()).post('/auth/logout').expect(401);
    });

    it('should return 401 if access token in cookie is invalid', async () => {
      await request(app.getHttpServer()).post('/auth/logout').expect(401);
    });

    it('should return 200 and clear cookie', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', cookies)
        .expect(200);

      clearedCookies = res.headers['set-cookie'][0];
      expect(clearedCookies).toContain('access_token=;');
    });

    it('should not allow access to protected route after logout', async () => {
      await request(app.getHttpServer())
        .get('/user/current-user')
        .set('Cookie', clearedCookies)
        .expect(401);
    });
  });
});
