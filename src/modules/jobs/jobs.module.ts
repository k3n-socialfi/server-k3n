import { forwardRef, Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { UserService } from '../users/user.service';
import { TwitterService } from '../twitter/twitter.service';
import { UserModule } from '../users/user.module';
import { TwitterModule } from '../twitter/twitter.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobs } from './entities/jobs.entity';
import { JobsController } from './jobs.controller';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Jobs]), TwitterModule, UserModule, forwardRef(() => TwitterModule)],

  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService]
})
export class JobsModule {}
