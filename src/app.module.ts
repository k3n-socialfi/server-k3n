import { LoggerType } from '@common/constants/enum';
import { MyConfigService } from '@config/config.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './modules/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      expandVariables: true,
      load: [MyConfigService.getConfiguration],
      isGlobal: true
    }),
    CacheModule.registerAsync(MyConfigService.getRedisConfig()),
    JwtModule.register(MyConfigService.getJwtConfig()),
    TypeOrmModule.forRoot(MyConfigService.getTypeOrmConfig()),
    WinstonModule.forRoot(MyConfigService.getWinstonConfig(LoggerType.APP)),
    CoreModule,
    TerminusModule,
    HttpModule,

  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }