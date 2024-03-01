import { MyConfigService } from '@config/config.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [MyConfigService],
  exports: [MyConfigService]
})
export class MyConfigModule { }
