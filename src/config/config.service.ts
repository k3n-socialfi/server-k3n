import { Mixin } from 'ts-mixer';

import { LogConfig } from './log.config';
import { TypeOrmConfig } from './mongodb.config';
// import { RedisConfig } from './redis.config';

export class MyConfigService extends Mixin(LogConfig, TypeOrmConfig) {
  /**
   * @returns config
   */
  public static getConfiguration() {
    return {
      port: parseInt(process.env.PORT, 10) || 3001,
      // redis: {
      //   host: process.env.REDIS_HOST || 'localhost',
      //   port: parseInt(process.env.REDIS_PORT) || 6379
      // }
    };
  }
}
