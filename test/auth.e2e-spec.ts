import * as request from 'supertest';
import { LoginDto, RegisterDto } from '../src/auth/dto';
import { app, setupE2ETest, teardownE2ETest } from './e2e-setup';

describe('Auth (e2e)', () => {
  beforeAll(async () => {
    await setupE2ETest();
  }, 10000);

  afterAll(async () => {
    await teardownE2ETest();
  })

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
    it('should throw if email empty', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ password: registerDto.password })
        .expect(400);
    })
    it('should throw if password empty', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: registerDto.email })
        .expect(400);
    })
    it('should throw if no body provided', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .expect(400);
    })
    it('should register', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);
      expect(res.body).toHaveProperty('access_token');
    });
  });

  describe('Login', () => {
    it('should throw if email empty', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: loginDto.password })
        .expect(400);
    })
    it('should throw if password empty', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: loginDto.email })
        .expect(400);
    })
    it('should throw if no body provided', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .expect(400);
    })
    it('should login', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);
      expect(res.body).toHaveProperty('access_token');
    });
  });

})
