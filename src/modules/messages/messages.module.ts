import { forwardRef, Module } from '@nestjs/common';
//import { JobsService } from './jobs.service';
import { UserService } from '../users/user.service';
import { TwitterService } from '../twitter/twitter.service';
import { UserModule } from '../users/user.module';
import { TwitterModule } from '../twitter/twitter.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { Jobs } from './entities/jobs.entity';
//import { JobsController } from './jobs.controller';
import { User } from '../users/entities/user.entity';
import {Messages} from './entities/messages.entity'
import { MessageService } from './messages.service';
import { MessagesController } from './messages.controller';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Messages]), UserModule, forwardRef(() => TwitterModule)],

  controllers: [MessagesController],
  providers: [MessageService],
  exports: [MessageService]
})
export class MessagesModule {}
