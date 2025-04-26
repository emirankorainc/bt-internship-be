import { Injectable } from '@nestjs/common';
import { apiConfig } from '../';
import { ApiConfig, ApiDocumentation } from '../types/api-config.type';

@Injectable()
export class AppConfigService {
  private apiConfig: ApiConfig;

  constructor() {
    this.apiConfig = apiConfig;
  }

  public get env(): string {
    return this.apiConfig.envName;
  }

  public get serverPort(): number {
    return (
      Number(process.env['PORT']) ||
      Number(process.env['APP_PORT']) ||
      this.apiConfig.serverPort
    );
  }

  public get dbConfig() {
    return this.apiConfig.dbConfig;
  }

  public get isProductionZone(): boolean {
    return this.env === 'p';
  }

  public get apiDocumentation(): ApiDocumentation {
    return this.apiConfig.apiDocumentation;
  }
}
