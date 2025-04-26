import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { runSeed } from '../seed';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  override async $connect(): Promise<void> {
    try {
      await super.$connect();
    } catch (e) {
      console.log('Error connecting to database: ', e);
    }
  }
  async onModuleInit() {
    try {
      await this['$connect']();
      console.info(`Migrations Starting #${process.pid}`);
      execSync(
        `npx prisma migrate dev --schema ./prisma/schema.prisma --skip-generate`,
        { stdio: 'inherit' },
      );
      console.info(`Migrations Finished #${process.pid}`);

      await runSeed();
    } catch (e) {
      console.log('Error initializing prisma module: ', e);
    }
  }

  async onModuleDestroy() {
    await this['$disconnect']();
  }

  cleanDb() {
    return this.$transaction([
      this.user.deleteMany(),
    ]);
  }
}
