import { RapidApiEndpoints, TwitterEndpoints } from '@common/constants/twitter-endpoints';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  forwardRef,
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
import { IntervalTime } from '@common/constants/enum';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { TwitterPoints } from './dto/twitter-points.dto';
import { UserService } from '../users/user.service';
import { TwPoints } from './entities/twitter-points.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TwitterUsers } from '../users/entities/twitter-user.entity';

@Injectable()
export class TwitterService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @InjectRepository(TwPoints) private twitterPointRep: Repository<TwPoints>,
    @InjectRepository(TwitterUsers) private twitterUsersRep: Repository<TwitterUsers>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  // @Timeout(0)
  async TwitterJob() {
    try {
      console.log('Start run twitter job !');
      const twitterUsers = await this.twitterUsersRep.find();
      for (let i = 0; i < twitterUsers.length; i++) {
        const twPoints = await this.getUserTweetPoints({ username: twitterUsers[i].username });
        let twitterPoints =
          twPoints.allTweets.totalFavoriteCount +
          twPoints.allTweets.totalRetweetCount * 2 +
          twPoints.allTweets.totalReplyCount * 2 +
          twPoints.allTweets.totalQuoteCount * 3 +
          twPoints.allTweets.totalViews +
          twPoints.latestTweet.favoriteCount +
          twPoints.latestTweet.retweetCount * 2 +
          twPoints.latestTweet.replyCount * 2 +
          twPoints.latestTweet.quoteCount * 3 +
          twPoints.latestTweet.views;
        // const royaltyPoints = user.royaltyPoints;

        twitterUsers[i].twitterPoints = twitterPoints;

        await this.twitterUsersRep.save(twitterUsers[i]);
      }

      const batchSize = 1;
      const batches = [];
      for (let i = 0; i < twitterUsers.length; i += batchSize) {
        batches.push(twitterUsers.slice(i, i + batchSize));
      }
      batches.map(async (batch) => {
        await Promise.all(
          batch.map(async (user) => {
            const twPoints = await this.getUserTweetPoints(user.username);
            let twitterPoints =
              twPoints.allTweets.totalFavoriteCount +
              twPoints.allTweets.totalRetweetCount * 2 +
              twPoints.allTweets.totalReplyCount * 2 +
              twPoints.allTweets.totalQuoteCount * 3 +
              twPoints.allTweets.totalViews +
              twPoints.latestTweet.favoriteCount +
              twPoints.latestTweet.retweetCount * 2 +
              twPoints.latestTweet.replyCount * 2 +
              twPoints.latestTweet.quoteCount * 3 +
              twPoints.latestTweet.views;
            // const royaltyPoints = user.royaltyPoints;

            user.twitterPoints = twitterPoints;

            await this.twitterUsersRep.save(user);
          })
        );
      });
      console.log('Running transaction job is done !');
    } catch (err) {
      console.log('err:', err);
    }
  }
  async findTwitterUsersByUsername(username: string): Promise<TwitterUserDetailResponseDto> {
    try {
      const headers = this.configService.get('rapidApi');
      const call = this.httpService
        .get(RapidApiEndpoints.USER_DETAILS + `?username=${username}`, {
          headers
        })
        .toPromise();

      const res = (await call)?.data;
      //   console.log('res:', res);
      return res;
    } catch (err) {
      // console.error('err:', err)
      // this.logger.error(err, err.stack, TwitterService.name);
      this.logger.error(err?.response?.data?.errors, err.stack, TwitterService.name);
      throw new InternalServerErrorException(err?.response?.data?.errors);
    }
  }

  async findTwitterUsersById(id: string) {
    try {
      const headers = this.configService.get('rapidApi');
      const call = this.httpService
        .get(RapidApiEndpoints.USER_DETAILS + `?user_id=${id}`, {
          headers
        })
        .toPromise();
      const res = (await call)?.data;
      //   console.log('res:', res);
      return res;
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

  async getUserTweetPoints({ username, time }: { username: string; time?: string }) {
    const nowMs = Date.now();
    const tweets = await this.getUserTweets({ username, limit: 20, includePinned: true, includeReplies: false });
    let totalFavoriteCount = 0;
    let totalRetweetCount = 0;
    let totalReplyCount = 0;
    let totalQuoteCount = 0;
    let totalViews = 0;
    tweets.map((tweet: any) => {
      const tweetTime = new Date(tweet.creation_date);
      if (time) {
        const intervalTime = IntervalTime[time];
        if (tweetTime.getTime() >= nowMs - intervalTime * 1000) {
          totalFavoriteCount += tweet.favorite_count;
          totalRetweetCount += tweet.retweet_count;
          totalReplyCount += tweet.reply_count;
          totalQuoteCount += tweet.quote_count;
          totalViews += tweet.views;
        }
      } else {
        totalFavoriteCount += tweet.favorite_count;
        totalRetweetCount += tweet.retweet_count;
        totalReplyCount += tweet.reply_count;
        totalQuoteCount += tweet.quote_count;
        totalViews += tweet.views;
      }
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

  async updateUserTweetPointsTrending(userId: string, username: string) {
    const nowMs = Date.now();
    const tweets = await this.getUserTweets({ username, limit: 20, includePinned: true, includeReplies: false });
    let oneDay: TwitterPoints;
    let threeDays: TwitterPoints;
    let sevenDays: TwitterPoints;
    let allTweets: TwitterPoints;
    tweets.map((tweet: any) => {
      const tweetTime = new Date(tweet.creation_date);

      if (tweetTime.getTime() >= nowMs - IntervalTime['1d'] * 1000) {
        oneDay.totalFavoriteCount += tweet.favorite_count;
        oneDay.totalRetweetCount += tweet.retweet_count;
        oneDay.totalReplyCount += tweet.reply_count;
        oneDay.totalQuoteCount += tweet.quote_count;
        oneDay.totalViews += tweet.views;
        oneDay.totalTweets += 1;

        threeDays.totalFavoriteCount += tweet.favorite_count;
        threeDays.totalRetweetCount += tweet.retweet_count;
        threeDays.totalReplyCount += tweet.reply_count;
        threeDays.totalQuoteCount += tweet.quote_count;
        threeDays.totalViews += tweet.views;
        threeDays.totalTweets += 1;

        sevenDays.totalFavoriteCount += tweet.favorite_count;
        sevenDays.totalRetweetCount += tweet.retweet_count;
        sevenDays.totalReplyCount += tweet.reply_count;
        sevenDays.totalQuoteCount += tweet.quote_count;
        sevenDays.totalViews += tweet.views;
        sevenDays.totalTweets += 1;
      } else if (tweetTime.getTime() >= nowMs - IntervalTime['3d'] * 1000) {
        threeDays.totalFavoriteCount += tweet.favorite_count;
        threeDays.totalRetweetCount += tweet.retweet_count;
        threeDays.totalReplyCount += tweet.reply_count;
        threeDays.totalQuoteCount += tweet.quote_count;
        threeDays.totalViews += tweet.views;
        threeDays.totalTweets += 1;

        sevenDays.totalFavoriteCount += tweet.favorite_count;
        sevenDays.totalRetweetCount += tweet.retweet_count;
        sevenDays.totalReplyCount += tweet.reply_count;
        sevenDays.totalQuoteCount += tweet.quote_count;
        sevenDays.totalViews += tweet.views;
        sevenDays.totalTweets += 1;
      } else if (tweetTime.getTime() >= nowMs - IntervalTime['7d'] * 1000) {
        sevenDays.totalFavoriteCount += tweet.favorite_count;
        sevenDays.totalRetweetCount += tweet.retweet_count;
        sevenDays.totalReplyCount += tweet.reply_count;
        sevenDays.totalQuoteCount += tweet.quote_count;
        sevenDays.totalViews += tweet.views;
        sevenDays.totalTweets += 1;
      } else {
        allTweets.totalFavoriteCount += tweet.favorite_count;
        allTweets.totalRetweetCount += tweet.retweet_count;
        allTweets.totalReplyCount += tweet.reply_count;
        allTweets.totalQuoteCount += tweet.quote_count;
        allTweets.totalViews += tweet.views;
        allTweets.totalTweets += 1;
      }
    });
    allTweets.totalFavoriteCount += sevenDays.totalFavoriteCount;
    allTweets.totalRetweetCount += sevenDays.totalRetweetCount;
    allTweets.totalReplyCount += sevenDays.totalReplyCount;
    allTweets.totalQuoteCount += sevenDays.totalQuoteCount;
    allTweets.totalViews += sevenDays.totalViews;
    allTweets.totalTweets += sevenDays.totalTweets;
    // const rs = {
    //   oneDayTweets: oneDay,
    //   threeDayTweets: threeDays,
    //   sevenDayTweets: sevenDays,
    //   allTweets: {
    //     totalFavoriteCount,
    //     totalRetweetCount,
    //     totalReplyCount,
    //     totalQuoteCount,
    //     totalViews,
    //     totalTweets
    //   },
    //   latestTweet: {
    //     favoriteCount: tweets[0]?.favorite_count || 0,
    //     retweetCount: tweets[0]?.retweet_count || 0,
    //     replyCount: tweets[0]?.reply_count || 0,
    //     quoteCount: tweets[0]?.quote_count || 0,
    //     views: tweets[0]?.views || 0,
    //     creationDate: tweets[0]?.creation_date || null
    //   }
    // };

    const userTws = await this.twitterPointRep.findOne({
      where: {
        userId
      }
    });
    if (!userTws) {
      const created = {
        userId,
        username,
        oneDayTweets: oneDay,
        threeDayTweets: threeDays,
        sevenDayTweets: sevenDays,
        allTweets,
        latestTweet: {
          favoriteCount: tweets[0]?.favorite_count || 0,
          retweetCount: tweets[0]?.retweet_count || 0,
          replyCount: tweets[0]?.reply_count || 0,
          quoteCount: tweets[0]?.quote_count || 0,
          views: tweets[0]?.views || 0,
          creationDate: tweets[0]?.creation_date || null
        }
      };
      const saveUserTw = this.twitterPointRep.create(created);
      await this.twitterPointRep.save(saveUserTw);
      return saveUserTw;
    } else {
      userTws.oneDayTweets = oneDay;
      userTws.threeDayTweets = threeDays;
      userTws.sevenDayTweets = sevenDays;
      userTws.allTweets = allTweets;
      userTws.latestTweet = {
        favoriteCount: tweets[0]?.favorite_count || 0,
        retweetCount: tweets[0]?.retweet_count || 0,
        replyCount: tweets[0]?.reply_count || 0,
        quoteCount: tweets[0]?.quote_count || 0,
        views: tweets[0]?.views || 0,
        creationDate: tweets[0]?.creation_date || null
      };
      await this.twitterPointRep.save(userTws);
      return userTws;
    }
  }
}
