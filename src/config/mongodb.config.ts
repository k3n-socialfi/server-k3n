import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class TypeOrmConfig {
    /**
     * @returns TypeOrmModuleOptions
     */
    public static getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'mongodb',
            // host: process.env.MONGO_HOST,
            // port: +process.env.MONGO_PORT,
            // username: process.env.MONGO_USERNAME,
            // password: process.env.MONGO_PASSWORD,
            database: process.env.MONGO_DATABASE,
            url: process.env.MONGO_URL,
            autoLoadEntities: true,
            synchronize: true,
            entities: [],
            extra: { authSource: 'admin' },
        };
    }
}