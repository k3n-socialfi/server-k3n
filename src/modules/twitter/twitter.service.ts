import { TwitterEndpoints } from '@common/constants/twitter-endpoints';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class TwitterService {
    constructor(
        private readonly httpService: HttpService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
    ) { }
    async findTwitterUsers(username: string) {
        try {
            const headers = {
                "authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
            };

            const call = this.httpService.get(TwitterEndpoints.USER_BY_USERNAME + `${username}`, {
                headers
            }).toPromise();

            const res = (await call)?.data?.data;
            return {
                id: res?.id,
                name: res?.name,
                username: res?.username
            };
        }
        catch (err) {
            // console.error('err:', err)
            // this.logger.error(err, err.stack, TwitterService.name);
            this.logger.error(err?.response?.data?.errors, err.stack, TwitterService.name);
            throw new InternalServerErrorException(err?.response?.data?.errors);
        }
    }
}
