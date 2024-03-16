import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        // configService: ConfigService,
        // private readonly usersService: UsersService,
    ) {
        super({
            // Put config in `.env`
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            clientType: 'confidential',
            callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
    ) {
        const { id, name, emails } = profile;
        console.log('emails:', emails)
        console.log('name:', name)
        console.log('id:', id)

        // Here a custom User object is returned. In the the repo I'm using a UsersService with repository pattern, learn more here: https://docs.nestjs.com/techniques/database
        return {
            provider: 'google',
            providerId: id,
            name: name.givenName,
            username: emails[0].value,
        };
    }
}