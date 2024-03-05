import { Mixin } from 'ts-mixer';

import { LogConfig } from './log.config';
import { TypeOrmConfig } from './mongodb.config';
import { JwtConfig } from './auth.config';
// import { RedisConfig } from './redis.config';

export class MyConfigService extends Mixin(LogConfig, TypeOrmConfig, JwtConfig) {
  /**
   * @returns config
   */
  public static getConfiguration() {
    return {
      port: parseInt(process.env.PORT, 10) || 3001,
      jwt: {
        access_secret: process.env.JWT_ACCESS_SECRET,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: process.env.ACCESS_EXPIRES_TIME,
        refreshExpiresIn: process.env.REFRESH_EXPIRES_TIME,
      }
      // redis: {
      //   host: process.env.REDIS_HOST || 'localhost',
      //   port: parseInt(process.env.REDIS_PORT) || 6379
      // }
    };
  }
}
