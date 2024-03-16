import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TwitterModule } from './twitter/twitter.module';
import { OauthModule } from './oauth/oauth.module';

@Module({
    imports: [UserModule, AuthModule, TwitterModule, OauthModule]
})
export class CoreModule { }