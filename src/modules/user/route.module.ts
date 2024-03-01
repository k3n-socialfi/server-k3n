import { Module } from '@nestjs/common';
import { UserService } from './route.service';
import { UserController } from './route.controller';

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }