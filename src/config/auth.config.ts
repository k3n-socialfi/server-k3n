import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

export class JwtConfig {
    /**
     * @returns JwtModuleOptions
     */
    public static getJwtConfig(): JwtModuleOptions {
        return {
            global: true,
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: process.env.EXPIRES_TIME },
        };
    }
}