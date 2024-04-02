import { forwardRef, Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TwitterController } from './twitter.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { TwPoints } from './entities/twitter-points.entity';
import { Reflector } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TwitterUsers } from '../users/entities/twitter-user.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([TwPoints, TwitterUsers]), forwardRef(() => UserModule)],
  providers: [TwitterService],
  controllers: [TwitterController],
  exports: [TwitterService]
})
export class TwitterModule {}
