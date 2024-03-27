import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TwitterController } from './twitter.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TwitterService],
  controllers: [TwitterController],
  exports: [TwitterService]
})
export class TwitterModule {}
