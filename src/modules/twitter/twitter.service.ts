import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class TwitterService {
    constructor(
        private readonly httpService: HttpService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
    ) { }
    async findTwitterUsers(username: string) {
        return 'user';
    }
}
