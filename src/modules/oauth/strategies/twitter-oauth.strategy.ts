import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from '@superfaceai/passport-twitter-oauth2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterOauthStrategy extends PassportStrategy(Strategy, 'twitter') {
    constructor(
        // configService: ConfigService,
        // private readonly usersService: UsersService,
    ) {
        super({
            // Put config in `.env`
            clientID: process.env.TWITTER_CLIENT_ID as string,
            clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
            clientType: "confidential",
            callbackURL: process.env.TWITTER_CALLBACK_URL as string,
            scope: ['tweet.read', 'users.read', 'offline.access'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
        console.log('accessToken:', accessToken)
        // console.log("Success!", { accessToken, refreshToken });

        return done(null, profile);
    }
}