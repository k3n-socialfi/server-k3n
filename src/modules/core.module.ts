import { Module } from '@nestjs/common';
import { UserModule } from './user/route.module';

@Module({
    imports: [UserModule]
})
export class CoreModule { }