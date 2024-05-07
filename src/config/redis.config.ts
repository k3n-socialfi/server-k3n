import { CacheModuleAsyncOptions, CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

export class RedisConfig {
  /**
   * @returns CacheModuleOptions
   */
  public static getRedisConfig(): CacheModuleAsyncOptions {
    return RedisOptions;
  }
}

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async () => {
    const store = await redisStore({
      password: process.env.REDIS_PASSWORD,
      url: process.env.REDIS_URL
    });
    return {
      store: () => store
    };
  }
};
