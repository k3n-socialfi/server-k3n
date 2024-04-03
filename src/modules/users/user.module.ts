import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { TwitterModule } from '../twitter/twitter.module';
import { TwitterUsers } from './entities/twitter-user.entity';
import { UserExperiences } from './entities/experience.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, TwitterUsers, UserExperiences]),
    forwardRef(() => TwitterModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
