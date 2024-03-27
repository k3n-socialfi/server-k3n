import { RapidApiEndpoints, TwitterEndpoints } from '@common/constants/twitter-endpoints';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TwitterUserDetailResponseDto } from './dto/response/user-detail-response.dto';
import { TweetDetailResponseDto } from './dto/response/tweet-detail-response.dto';

@Injectable()
export class TwitterService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) {}
  async findTwitterUsers(username: string): Promise<TwitterUserDetailResponseDto> {
    try {
      const headers = this.configService.get('rapidApi');
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
      const headers = this.configService.get('rapidApi');
      const userId = await this.findTwitterUserId(username);
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
      const headers = this.configService.get('rapidApi');

      const userId = await this.findTwitterUserId(username);
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

  async getTweetDetail(tweetId: string) {
    const headers = this.configService.get('rapidApi');

    const call = this.httpService
      .get(RapidApiEndpoints.TWEET_DETAILS + `?tweet_id=${tweetId}`, {
        headers
      })
      .toPromise();

    const res = (await call)?.data;

    if (!res.tweet_id) {
      this.logger.error(res?.detail, TwitterService.name);
      throw new BadRequestException(res?.detail);
    }

    return {
      tweet_id: res.tweet_id,
      creation_date: res.creation_date,
      text: res.text,
      media_url: res.media_url,
      video_url: res.video_url,
      user: res.user
    };
  }

  async getUserTweets({
    username,
    userId,
    limit,
    includeReplies,
    includePinned
  }: {
    username?: string;
    userId?: string;
    limit?: number;
    includeReplies?: boolean;
    includePinned?: boolean;
  }) {
    const headers = this.configService.get('rapidApi');
    const url = new URL(RapidApiEndpoints.USER_TWEETS);
    if (username) {
      url.searchParams.append('username', username);
    }

    if (limit) {
      url.searchParams.append('limit', limit.toString());
    }

    if (userId) {
      url.searchParams.append('user_id', userId);
    }

    if (includeReplies !== undefined) {
      url.searchParams.append('include_replies', includeReplies.toString());
    }

    if (includePinned !== undefined) {
      url.searchParams.append('include_pinned', includePinned.toString());
    }
    console.log('url.toString():', url.toString());
    const call = this.httpService
      .get(url.toString(), {
        headers
      })
      .toPromise();

    const res = (await call)?.data?.results;
    return res;
  }

  async getUserTweetPoints(username: string) {
    const tweets = await this.getUserTweets({ username, limit: 20, includePinned: true, includeReplies: false });
    let totalFavoriteCount = 0;
    let totalRetweetCount = 0;
    let totalReplyCount = 0;
    let totalQuoteCount = 0;
    let totalViews = 0;
    tweets.map((tweet) => {
      totalFavoriteCount += tweet.favorite_count;
      totalRetweetCount += tweet.retweet_count;
      totalReplyCount += tweet.reply_count;
      totalQuoteCount += tweet.quote_count;
      totalViews += tweet.views;
    });
    return {
      allTweets: {
        totalFavoriteCount,
        totalRetweetCount,
        totalReplyCount,
        totalQuoteCount,
        totalViews
      },
      latestTweet: {
        favoriteCount: tweets[0]?.favorite_count || 0,
        retweetCount: tweets[0]?.retweet_count || 0,
        replyCount: tweets[0]?.reply_count || 0,
        quoteCount: tweets[0]?.quote_count || 0,
        views: tweets[0]?.views || 0
      }
    };
  }
}
