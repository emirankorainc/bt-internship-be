import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as cookieParser from 'cookie-parser';

export let app: INestApplication;
export let prisma: PrismaService;

export const setupE2ETest = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  await app.init();
  await app.listen(4001);

  prisma = app.get(PrismaService);
  await prisma.cleanDb();
};

export const teardownE2ETest = async () => {
  if (app) await app.close();
};
