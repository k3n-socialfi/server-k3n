import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { TwitterOauthGuard } from './guards/twitter-oauth.guard';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('oauth')
@ApiTags('Oauth')
export class OauthController {
  constructor(private readonly authService: AuthService) {}

  @Get('twitter')
  @UseGuards(TwitterOauthGuard)
  async twitterAuth(@Req() req) {
    // Guard redirects
  }

  @Get('twitter/callback')
  @UseGuards(TwitterOauthGuard)
  async twitterAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    const rs = await this.authService.loginWithTwitter({
      id: userObject?.id,
      username: userObject?.username
      // displayName: userObject?.displayName,
      // image: userObject?._json?.profile_image_url
    });
    return res.redirect(
      `https://client-k3n.vercel.app/login?accessToken=${rs.accessToken}&refreshToken=${rs.refreshToken}`
    );
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() _req) {
    // Guard redirects
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    // For now, we'll just show the user object

    console.log('req:', req.user);
    // res.redirect('/profile');
    // return {}
  }
}
