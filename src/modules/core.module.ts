import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TwitterModule } from './twitter/twitter.module';
import { OauthModule } from './oauth/oauth.module';
import { JobsModule } from './jobs/jobs.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [UserModule, AuthModule, TwitterModule, OauthModule, JobsModule]
})
export class CoreModule {}
