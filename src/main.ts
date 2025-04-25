import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { execSync } from 'child_process';
import { AppModule } from './app.module';
import { AppConfigService } from 'config/service/appConfig.service';
import { INestApplication, Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';

// if (isFlagEnabled(FEATURE_FLAGS.DEV_DROP_DATABASE)) {
//   console.log('*** Start:  Dropping the db ***');
//   execSync(`npx prisma migrate reset --force`, { stdio: 'inherit' });
//   console.log('*** Finish: Dropping the db ***');
// }

execSync(`npx prisma migrate deploy`, { stdio: 'inherit' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  const appConfig = app.get(AppConfigService);
  app.useGlobalPipes(new ValidationPipe);

  app.enableCors({
    credentials: true,
    origin: true,
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix, {
    exclude: [
      {
        path: '/',
        method: RequestMethod.GET,
      },
    ],
  });

  initDocumentation(app, appConfig);

  const host = '0.0.0.0';
  const port = process.env.PORT || 4000;
  await app.listen(port, host);
  Logger.log(
    `🚀 Application is running on: http://${host}:${port}/${globalPrefix}`,
  );
}

const initDocumentation = (
  app: INestApplication,
  appConfig: AppConfigService,
) => {
  if (!appConfig.apiDocumentation.isEnabled) {
    return;
  }

  const devModules = [PrismaModule];

  const configNonDev = new DocumentBuilder()
    .setTitle('Bloomteq Setup API')
    .setDescription('')
    .addBearerAuth()
    .setVersion('1')
    .addTag('Events')
    .build();

  const documentNonDev = SwaggerModule.createDocument(app, configNonDev, {
    operationIdFactory: (controllerKey, methodKey) => methodKey,
  });
  SwaggerModule.setup('api', app, documentNonDev);

  const configDevSupport = new DocumentBuilder()
    .setTitle('DevSupport Bloomteq API')
    .setDescription("Developer's support documentation for Bloomteq API")
    .addBearerAuth()
    .setVersion('1')
    .build();

  const documentDevSupport = SwaggerModule.createDocument(
    app,
    configDevSupport,
    { include: devModules },
  );
  SwaggerModule.setup('api-docs', app, documentDevSupport);
};

void bootstrap();
