import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TwitterService } from './twitter.service';

@Controller('twitter')
@ApiTags('Twitter')
export class TwitterController {
    constructor(private readonly twitterService: TwitterService) { }
    @Get(':username')
    public async getAllUsers(@Param('username') username: string) {

        return {
            code: 200,
            message: "Get all user successful",
            data: await this.twitterService.findTwitterUsers(username)
        };

    }
}
