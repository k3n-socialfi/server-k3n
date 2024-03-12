import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TwitterModule } from './twitter/twitter.module';

@Module({
    imports: [UserModule, AuthModule, TwitterModule]
})
export class CoreModule { }