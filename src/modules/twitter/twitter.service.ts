import { RapidApiEndpoints, TwitterEndpoints } from '@common/constants/twitter-endpoints';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TwitterUserDetailResponseDto } from './dto/response/user-detail-response.dto';

@Injectable()
export class TwitterService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) {}
  async findTwitterUsers(username: string): Promise<TwitterUserDetailResponseDto> {
    try {
      const headers = {
        'X-RapidAPI-Key': '1373bafc8bmsh88dd4ac6d2b27d8p14957fjsnbafbc51d7e9b',
        'X-RapidAPI-Host': 'twitter154.p.rapidapi.com'
      };

      const call = this.httpService
        .get(RapidApiEndpoints.USER_DETAILS + `?username=${username}`, {
          headers
        })
        .toPromise();

      const res = (await call)?.data;
      //   console.log('res:', res);
      return {
        userId: res?.user_id,
        username: res?.username,
        name: res?.name,
        followerCount: res?.follower_count,
        followingCount: res?.following_count,
        favouritesCount: res?.favourites_count,
        isPrivate: res?.is_private,
        isVerified: res?.is_verified,
        isBlueVerified: res?.is_blue_verified,
        location: res?.location,
        profilePicUrl: res?.profile_pic_url,
        profileBannerUrl: res?.profile_banner_url,
        description: res?.description,
        externalUrl: res?.external_url,
        numberOfTweets: res?.number_of_tweets,
        bot: res?.bot,
        timestamp: res?.timestamp,
        hasNftAvatar: res?.has_nft_avatar,
        category: res?.category,
        defaultProfile: res?.default_profile,
        defaultProfileImage: res?.default_profile_image,
        listedCount: res?.listed_count,
        verifiedType: res?.verified_type,
        creationDate: res?.creation_date
      };
    } catch (err) {
      // console.error('err:', err)
      // this.logger.error(err, err.stack, TwitterService.name);
      this.logger.error(err?.response?.data?.errors, err.stack, TwitterService.name);
      throw new InternalServerErrorException(err?.response?.data?.errors);
    }
  }
  async findTwitterUsersFollowing(username: string): Promise<any> {
    try {
      const headers = {
        'X-RapidAPI-Key': '1373bafc8bmsh88dd4ac6d2b27d8p14957fjsnbafbc51d7e9b',
        'X-RapidAPI-Host': 'twitter154.p.rapidapi.com'
      };

      const userId = await this.findTwitterUserId(username);
      console.log('userId:', userId);
      const call = this.httpService
        .get(RapidApiEndpoints.USER_FOLLOWING + `?user_id=${userId}`, {
          headers
        })
        .toPromise();

      const res = (await call)?.data;
      //   console.log('res:', res);
      return res?.results;
    } catch (err) {
      // console.error('err:', err)
      // this.logger.error(err, err.stack, TwitterService.name);
      this.logger.error(err?.response?.data?.errors, err.stack, TwitterService.name);
      throw new InternalServerErrorException(err?.response?.data?.errors);
    }
  }

  async findTwitterUsersFollowers(username: string): Promise<any> {
    try {
      const headers = {
        'X-RapidAPI-Key': '1373bafc8bmsh88dd4ac6d2b27d8p14957fjsnbafbc51d7e9b',
        'X-RapidAPI-Host': 'twitter154.p.rapidapi.com'
      };

      const userId = await this.findTwitterUserId(username);
      console.log('userId:', userId);
      const call = this.httpService
        .get(RapidApiEndpoints.USER_FOLLOWERS + `?user_id=${userId}`, {
          headers
        })
        .toPromise();

      const res = (await call)?.data;
      //   console.log('res:', res);
      return res?.results;
    } catch (err) {
      // console.error('err:', err)
      // this.logger.error(err, err.stack, TwitterService.name);
      this.logger.error(err?.response?.data?.errors, err.stack, TwitterService.name);
      throw new InternalServerErrorException(err?.response?.data?.errors);
    }
  }

  async findTwitterUserId(username: string): Promise<string> {
    try {
      const headers = {
        authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
      };

      const call = this.httpService
        .get(TwitterEndpoints.USER_BY_USERNAME + `${username}`, {
          headers
        })
        .toPromise();

      const res = (await call)?.data?.data;
      return res?.id;
    } catch (err) {
      // console.error('err:', err)
      // this.logger.error(err, err.stack, TwitterService.name);
      this.logger.error(err?.response?.data?.errors, err.stack, TwitterService.name);
      throw new InternalServerErrorException(err?.response?.data?.errors);
    }
  }
}
