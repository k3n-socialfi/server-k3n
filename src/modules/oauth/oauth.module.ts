import { Module } from '@nestjs/common';
import { SessionModule } from 'nestjs-session';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { TwitterOauthStrategy } from './strategies/twitter-oauth.strategy';
import { PassportModule } from '@nestjs/passport';
import { GoogleOauthStrategy } from './strategies/google-oauth.strategy';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PassportModule.register({}),
    SessionModule.forRoot({ // Initialize session support
      session: { secret: 'keyboard cat' },
    }),
    AuthModule
  ],
  controllers: [OauthController],
  providers: [OauthService, TwitterOauthStrategy, GoogleOauthStrategy]
})
export class OauthModule { }
