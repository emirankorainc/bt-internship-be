import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma-client';
import { execSync } from 'child_process';
// import { runSeed } from './seed';
// import { FEATURE_FLAGS, isFlagEnabled } from '@bloomteq/feature-flags';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this['$connect']();

    // console.info(`Migrations Starting #${process.pid}`);
    // execSync(`npx nx run models:migrate-up`, { stdio: 'inherit' });
    // console.info(`Migrations Finished #${process.pid}`);

    // if (isFlagEnabled(FEATURE_FLAGS.RUN_SEEDS)) {
    // await runSeed();
    // }
  }

  async onModuleDestroy() {
    await this['$disconnect']();
  }
}
