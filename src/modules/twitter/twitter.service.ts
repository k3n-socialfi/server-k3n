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
import { CreateTwitterPortfolioDto } from './dto/request/create-portfolio';
import { TwitterPortfolio } from './entities/portfolio.entity';

@Injectable()
export class TwitterService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @InjectRepository(TwPoints) private twitterPointRep: Repository<TwPoints>,
    @InjectRepository(TwitterPortfolio) private twitterPortfolioRep: Repository<TwitterPortfolio>,
    @InjectRepository(TwitterUsers) private twitterUsersRep: Repository<TwitterUsers>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) {}

  @Cron('0 0 * * *')
  async KolsRankingJob() {
  // @Timeout(0)
    try {
      console.log('Start update ranking job !');
      await this.updateRanks();
      console.log('End update ranking job !');
    } catch (err) {
      console.log('err:', err);
    }
  }

  // 7 day update
  @Cron('0 0 * * 0')
  // @Timeout(0)
  async KolsRankingJob7DaysUpdate() {
    try {
      console.log('Start 7 days update ranking job !');
      await this.updateRanks7Days();
      console.log('End 7 days update ranking job !');
    } catch (err) {
      console.log('err:', err);
    }
  }

  @Cron('0 0 1 * *')
  // @Timeout(0)
  async KolsRankingJob30DaysUpdate() {
    try {
      console.log('Start 30 days update ranking job !');
      await this.updateRanks30Days();
      console.log('End 30 days update ranking job !');
    } catch (err) {
      console.log('err:', err);
    }
  }
  //@Cron(CronExpression.EVERY_12_HOURS)
  //@Cron('0 0 * * *')
  //@Timeout(0)
  async TwitterJob() {
    try {
      console.log('Start run update previous point !');
      //await this.KolsRankingJob();
      //await this.KolsRankingJob7DaysUpdate();
      //await this.KolsRankingJob30DaysUpdate();

      console.log('Start run twitter job !');

      // Get points
      //await this.twitterPointsCalculation();

      await this.twitterPointsCalculationNewVersion();

      //await this.twitterPointsCalculationByUsernameNewVersion('DustinH_13');
      //await this.twitterPointsCalculationByUsernameNewVersion('Emiel_ETN');
      // await this.twitterPointsCalculationByUsernameNewVersion('NftKay8');
      // SirKunt,KateMillerGems
      // Create User's Portfolio
      //await this.createUserTwitterPortfolio();

      // const batchSize = 1;
      // const batches = [];
      // for (let i = 0; i < twitterUsers.length; i += batchSize) {
      //   batches.push(twitterUsers.slice(i, i + batchSize));
      // }
      // batches.map(async (batch) => {
      //   await Promise.all(
      //     batch.map(async (user) => {
      //       const twPoints = await this.getUserTweetPoints(user.username);
      //       let twitterPoints =
      //         twPoints.allTweets.totalFavoriteCount +
      //         twPoints.allTweets.totalRetweetCount * 2 +
      //         twPoints.allTweets.totalReplyCount * 2 +
      //         twPoints.allTweets.totalQuoteCount * 3 +
      //         twPoints.allTweets.totalViews +
      //         twPoints.latestTweet.favoriteCount +
      //         twPoints.latestTweet.retweetCount * 2 +
      //         twPoints.latestTweet.replyCount * 2 +
      //         twPoints.latestTweet.quoteCount * 3 +
      //         twPoints.latestTweet.views;
      //       // const royaltyPoints = user.royaltyPoints;

      //       user.twitterPoints = twitterPoints;

      //       await this.twitterUsersRep.save(user);
      //     })
      //   );
      // });
      console.log('Running transaction job is done !');
    } catch (err) {
      console.log('err:', err);
    }
  }

  async TwitterJobByUserName(username: string) {
    try {
      console.log('Start run update previous point !');
      console.log('Start run twitter job !');
      console.log('name', username);

      //await this.twitterPointsCalculationNewVersion();


      // if (pass == '11223344'){
      //   console.log('bang');
      //   console.log('name', username);
      await this.twitterPointsCalculationByUsernameNewVersion(username);
      //}


      console.log('Running transaction job is done !');
    } catch (err) {
      console.log('err:', err);
    }
  }

  async twitterPointsCalculationByUsername(username: string) {
    const twitterUser = await this.twitterUsersRep.findOne({
      where: {
        username
      }
    });
    const twPoints = await this.getUserTweetPoints({ username });
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

    console.log('twitterPoints:', twitterPoints);
    let savePoint = Math.floor((1000 * twitterPoints) / 50000000);
    if (savePoint > 1000) savePoint = 1000;
    if (savePoint < 10 && twitterPoints > 0) savePoint = 10;
    console.log('savePoint:', savePoint);

    twitterUser.twitterPoints = savePoint;

    await this.twitterUsersRep.save(twitterUser);
  }

  async twitterPointsCalculation() {
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

      console.log('twitterPoints:', twitterPoints);
      let savePoint = Math.floor((1000 * twitterPoints) / 50000000);
      if (savePoint > 1000) savePoint = 1000;
      if (savePoint < 10 && twitterPoints > 0) savePoint = 10;
      console.log('savePoint:', savePoint);

      twitterUsers[i].twitterPoints = savePoint;

      await this.twitterUsersRep.save(twitterUsers[i]);
    }
  }
  async findTwitterUsersByUsername(username: string) {
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

  async updateRanks() {
    const users = await this.twitterUsersRep.find({
      order: {
        totalPoints: 'DESC'
      }
    });

    // Assign ranks based on the sorted order
    const rank = await Promise.all(
      users.map(async (user, index) => {
        user.previousPoint = user.totalPoints;
        //user.previousRank = index + 1;
        // const random7D = this.getRandomNumber(-15, 15);
        // user.previous7DRank = index + random7D > 0 ? index + random7D : -(index + random7D);
        // const random30D = this.getRandomNumber(-30, 30);
        // user.previous30DRank = index + random30D > 0 ? index + random30D : -(index + random30D);
        await this.twitterUsersRep.save(user);
        return {
          userId: user.userId,
          rank: index + 1
        };
      })
    );
    return rank;
  }

  async updateRanks7Days() {
    // const users = await this.twitterUsersRep.find({
    //   order: {
    //     totalPoints: 'DESC'
    //   }
    // });

    // get user
    const users = await this.twitterUsersRep.find();

    // Assign ranks based on the sorted order
    const rank = await Promise.all(
      users.map(async (user, index) => {
        user.previous7DPoint = user.totalPoints;

        await this.twitterUsersRep.save(user);
        return {
          userId: user.userId,
          rank: index + 1
        };
      })
    );
    return rank;
  }

  async updateRanks30Days() {
    // get user
    const users = await this.twitterUsersRep.find();

    // Assign ranks based on the sorted order
    const rank = await Promise.all(
      users.map(async (user, index) => {
        user.previous30DPoint = user.totalPoints;

        await this.twitterUsersRep.save(user);
        return {
          userId: user.userId,
          rank: index + 1
        };
      })
    );
    return rank;
  }
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
      const headers = this.configService.get('rapidApi');
      const call = this.httpService
        .get(RapidApiEndpoints.USER_DETAILS + `?username=${username}`, {
          headers
        })
        .toPromise();

      const res = (await call)?.data;
      //   console.log('res:', res);
      return res?.user_id;
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

    const res = (await call)?.data;
    return res;
  }

  async getUserTweetsContinuation({
    continuationToken,
    username,
    userId,
    limit,
    includeReplies
  }: {
    continuationToken: string;
    username?: string;
    userId?: string;
    limit?: number;
    includeReplies?: boolean;
  }) {
    const headers = this.configService.get('rapidApi');
    const url = new URL(RapidApiEndpoints.USER_TWEETS_CONTINUATION);

    url.searchParams.append('continuation_token', continuationToken);

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

    console.log('url.toString():', url.toString());
    const call = this.httpService
      .get(url.toString(), {
        headers
      })
      .toPromise();

    const res = (await call)?.data;
    return res;
  }

  async getUserTweetPoints({ username, time }: { username: string; time?: string }) {
    const nowMs = Date.now();
    let tweets = await this.getUserTweets({ username, limit: 20, includePinned: true, includeReplies: false });
    if (!tweets || !tweets?.results) tweets.results = [];
    let totalFavoriteCount = 0;
    let totalRetweetCount = 0;
    let totalReplyCount = 0;
    let totalQuoteCount = 0;
    let totalViews = 0;
    tweets.results.map((tweet: any) => {
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
    tweets.results.map((tweet: any) => {
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

  async createPortfolio(req: CreateTwitterPortfolioDto) {
    const userPort = await this.twitterPortfolioRep.findOne({
      where: {
        userId: req.userId,
        symbol: req.symbol
      }
    });

    if (!userPort) {
      console.log('create userPort:');
      const created = {
        userId: req.userId,
        username: req.username,
        tokenName: req.tokenName,
        contractAddress: req.contractAddress,
        symbol: req.symbol,
        image: req.image,
        chain: req.chain,
        firstTweetDate: req.firstTweetDate,
        firstTweet: req.firstTweet
      };
      try {
        const savePort = this.twitterPortfolioRep.create(created);
        await this.twitterPortfolioRep.save(savePort);
        return savePort;
      } catch (err) {
        console.log('err:', err);
      }
    }
  }

  async getRecentUserTweets({
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
    try {
      const tweets = await this.getUserTweets({ username, userId, limit, includeReplies, includePinned });

      let listTweets = [];
      // if tweets.status_code == 200
      if (!tweets || !tweets?.results || tweets.results.length === 0) {
        return listTweets;
      } else {
        listTweets.push(...tweets.results);
        const twContinuation = await this.getUserTweetsContinuation({
          continuationToken: tweets.continuation_token,
          username,
          userId,
          limit,
          includeReplies
        });
        if (!twContinuation || !twContinuation?.results || twContinuation?.results.length > 0) {
          listTweets.push(...twContinuation.results);
        }
      }
      return listTweets;
    } catch (err) {
      console.log('err:', err);
      // this.logger.error(err?.response?.data?.errors, err.stack, TwitterService.name);
      // throw new InternalServerErrorException(err?.response?.data?.errors);
    }
  }

  getTokenFromTweets(listTweets: any) {
    const tweetInfo = new Map<string, any>();
    const listToken = [];
    listTweets?.map((tweet: any) => {
      const text = tweet.text;
      const tokenSymbol = this.getTokenSymbolFromText(text);
      tokenSymbol.map((symbol) => {
        if (!listToken.includes(symbol)) listToken.push(symbol);
        tweetInfo.set(symbol, tweet);
      });
    });
    return { listToken, tweetInfo };
  }

  getTokenSymbolFromText(text: string) {
    const regex = /\$([A-Za-z]+)/g;
    const matches = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1].toUpperCase());
    }

    return matches;
  }

  async addTokenToPortfolio({
    username,
    listToken,
    tweetInfo
  }: {
    username: string;
    listToken: string[];
    tweetInfo: any;
  }) {
    console.log('listToken:', listToken);
    await Promise.all(
      listToken.map(async (token) => {
        const info = await this.getTokenInfoDexScreener(token);
        if (info) {
          const tweet = tweetInfo.get(token);
          const creationDate = tweet.creation_date;
          const date = this.formatDate(creationDate);
          // const tokenHistory = await this.getTokenPriceHistory(info.id, date);
          // console.log('tokenHistory:', tokenHistory);

          console.log('create-port');
          const port = await this.createPortfolio({
            userId: tweet.user.user_id,
            username: username,
            tokenName: info.baseToken.name,
            contractAddress: info.baseToken.address,
            symbol: info.baseToken.symbol,
            image: info?.info?.imageUrl,
            chain: info.chainId,
            firstTweetDate: creationDate,
            firstTweet: `https://twitter.com/${username}/status/${tweet.tweet_id}`
          });
          return port;
        }
      })
    );
  }

  async getTokenInfo(symbol: string) {
    try {
      const call = this.httpService.get(`https://api.coingecko.com/api/v3/search?query=${symbol}`).toPromise();
      const res = (await call)?.data;
      const info = res.coins[0];
      if (!info || info.length === 0) {
        return undefined;
      }
      return info;
    } catch (err) {
      console.log('err:', err);
    }
  }

  async getTokenInfoDexScreener(symbol: string) {
    try {
      const call = this.httpService.get(`https://api.dexscreener.com/latest/dex/search/?q=${symbol}`).toPromise();
      const res = (await call)?.data;
      const info = res.pairs;
      if (!info || info.length === 0) {
        return undefined;
      }
      return info[0];
    } catch (err) {
      console.log('err:', err);
    }
  }

  async getTokenPriceHistory(address: string, from: number, chain: string) {
    try {
      const millisecondsNow = Date.now();
      const to = Math.floor(millisecondsNow / 1000);
      const call = this.httpService
        .get(
          `https://public-api.birdeye.so/defi/history_price?address=${address}&address_type=token&type=1D&time_from=${from - 100}&time_to=${to}`,
          {
            headers: {
              accept: 'application/json',
              'x-chain': chain,
              'X-API-KEY': '87adffcbfb504663a6db5e5a8aceab24'
            }
          }
        )
        .toPromise();

      const res = await call;
      // console.log('res:', res.data?.data?.items?.[0]);
      if (!res || res.status != 200) return [];

      return res.data?.data?.items;
    } catch (err) {
      // console.log('err:', err);
      // this.logger.error(err?.response?.data?.errors, err.stack, TwitterService.name);
      // throw new InternalServerErrorException(err?.response?.data?.errors);
      return [];
    }
  }

  getTokenPriceATH(listPrice: any) {
    const ath = listPrice.reduce((max, item) => {
      return item.value > max ? item.value : max;
    }, listPrice?.[0]?.value || 0);
    return ath;
  }

  async getCurrentTokenPrice(address: string, chain: string) {
    try {
      const call = this.httpService
        .get(`https://public-api.birdeye.so/defi/price?address=${address}`, {
          headers: {
            accept: 'application/json',
            'x-chain': chain,
            'X-API-KEY': '87adffcbfb504663a6db5e5a8aceab24'
          }
        })
        .toPromise();

      const res = await call;
      if (!res || res.status != 200) return undefined;

      return {
        price: res.data?.data?.value
      };
    } catch (err) {
      console.log('err:', err);
      this.logger.error(err?.response?.data?.errors, err.stack, TwitterService.name);
      // throw new InternalServerErrorException(err?.response?.data?.errors);
      return undefined;
    }
  }

  async clearTokenPortfolio(userId: string) {
    await this.twitterPortfolioRep.delete({
      userId
    });
  }

  async createUserTwitterPortfolio() {
    const twitterUsers = await this.twitterUsersRep.find();
    for (let i = 0; i < twitterUsers.length; i++) {
      const tweets = await this.getRecentUserTweets({ username: twitterUsers[i].username, includePinned: true });

      const { listToken, tweetInfo } = this.getTokenFromTweets(tweets);
      await this.clearTokenPortfolio(twitterUsers[i].userId);
      await this.addTokenToPortfolio({ username: twitterUsers[i].username, listToken, tweetInfo });
    }

    // return port;
  }

  async getUserTwitterPortfolio(username: string) {
    const userId = await this.findTwitterUserId(username);

    //test only
    //const userId = '1380192890068951043';
    const userPortfolio = await this.twitterPortfolioRep.find({
      where: {
        userId
      }
    });

    //console.log('mock 2.1',userPortfolio);

    const portResponse = await Promise.all(
      userPortfolio.map(async (port) => {
        const dateObject = new Date(port.firstTweetDate);
        const timestamp = dateObject.getTime();
        const shillPrice = await this.getTokenPriceHistory(port.contractAddress, timestamp / 1000, port.chain);
        const ath = this.getTokenPriceATH(shillPrice);
        const currentPrice = await this.getCurrentTokenPrice(port.contractAddress, port.chain);
        const { _id, ...portData } = port;
        const pnl = (100 * (currentPrice?.price - shillPrice?.[0]?.value)) / shillPrice?.[0]?.value;
        return {
          shillPrice: shillPrice?.[0]?.value ? shillPrice?.[0]?.value : null,
          currentPrice: currentPrice?.price ? currentPrice?.price : null,
          ath: ath == 0 ? null : ath,
          pnl,
          ...portData
        };
      })
    );

    return portResponse;
  }

  async getMentionedProject(userId: string) {
    const userPortfolio = await this.twitterPortfolioRep.find({
      where: {
        userId
      }
    });
    const rs = await Promise.all(
      userPortfolio.map(async (port) => {
        const { _id, ...portData } = port;
        return portData;
      })
    );
    return rs;
  }

  async getPortfolioByUsername(username: string) {
    const tweets = await this.getRecentUserTweets({ username, includePinned: true });

    const { listToken, tweetInfo } = this.getTokenFromTweets(tweets);

    // await this.addTokenToPortfolio({ username, listToken, tweetInfo });

    const portfolio = await Promise.all(
      listToken.map(async (token) => {
        const info = await this.getTokenInfoDexScreener(token);
        if (info) {
          const tweet = tweetInfo.get(token);
          const creationDate = tweet.creation_date;

          const port = {
            userId: tweet.user.user_id,
            username: username,
            tokenName: info.baseToken.name,
            contractAddress: info.baseToken.address,
            symbol: info.baseToken.symbol,
            // image:
            // shillPrice: 1,
            firstTweetDate: creationDate,
            firstTweet: `https://twitter.com/${username}/status/${tweet.tweet_id}`
          };
          return port;
        }
      })
    );
    return portfolio;
  }

  formatDate(inputDate: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateParts = inputDate.split(' ');
    const day = dateParts[2];
    const monthIndex = months.indexOf(dateParts[1]);
    const month = (monthIndex + 1).toString().padStart(2, '0');
    const year = dateParts[5];

    return `${day}-${month}-${year}`;
  }

  async twitterPointsCalculationNewVersion() {
    //const twitterUsers = await this.twitterUsersRep.find();
    const twitterUsers = await this.twitterUsersRep.find({take: 1000});
    for (let i = 0; i < twitterUsers.length; i++) {
      const twPoints = await this.getUserTweetPoints({ username: twitterUsers[i].username });

      let view = twPoints.allTweets.totalViews;
      let like = twPoints.allTweets.totalFavoriteCount;
      let retweet = twPoints.allTweets.totalRetweetCount;
      let reply = twPoints.allTweets.totalReplyCount;

      // get user portfolio
      const userPortfolio = await this.getUserTwitterPortfolio(twitterUsers[i].username);

      const shillScoresList: number[] = [];

      for (let k = 0; k < userPortfolio.length; k++){

        let ath = ((userPortfolio[k].ath - userPortfolio[k].shillPrice) / userPortfolio[k].shillPrice) * 100;

        let currentPrice = ((userPortfolio[k].currentPrice - userPortfolio[k].shillPrice) / userPortfolio[k].shillPrice) * 100;

        const shillScore = await this.calculateShillScoreNewVersion(view, like, retweet, reply, ath, currentPrice);
        shillScoresList.push(shillScore);
      }

      //console.log('shill list',shillScoresList);
      // calculate average shill score
      const total = shillScoresList.reduce((sum, score) => sum + score, 0);
      let finalScore = Math.floor(total / shillScoresList.length);
      //console.log('shill score',finalScore);

      //if (finalScore > 9999) finalScore = 9999;
      if (finalScore < 1) finalScore = 1;
      console.log('savePoint:', finalScore);

      twitterUsers[i].twitterPoints = finalScore;

      await this.twitterUsersRep.save(twitterUsers[i]);
    }
  }

  async calculateShillScoreNewVersion(view: number, like: number, retweet: number, reply: number, ath: number, currentPrice: number) {
    // Calculate the weighted raw score

    //let v = (view - 100) / (100000 - 100);
    //let l = (like - 10) / (10000 - 10);
    let v: number; view >= 1000000 ? v = 1 : v = (view - 100) / (1000000 - 100);
    let l: number; like >= 10000 ? l = 1 : l = (like - 10) / (10000 - 10);
    let r: number; retweet >= 20000 ? r = 1 : r = (retweet - 10) / (20000 - 10);
    let rp:number; reply >= 10000 ? rp = 1 : rp = (reply - 5) / (10000 - 5);
    let new_ath: number; ath >= 1 ? new_ath = 0.1 : new_ath = (ath + 90) / (10000 + 90); // number
    let c:number; currentPrice >= 1 ? c = 0.1 : c = (currentPrice + 90) / (10000 + 90);
    const raw = (v + 2 * l + 4 * (r + rp)) / 11 + (3 * new_ath + c) / 4;
    console.log(`${view}, ${like}, ${retweet}, ${reply}, ${new_ath}, ${c}, ${raw}`)

    // Calculate the shill score
    const shill = 9998 * raw + 1;

    return shill;
  }

  async twitterPointsCalculationByUsernameNewVersion(username: string) {
    const twitterUser = await this.twitterUsersRep.findOne({
      where: {
        username
      }
    });
    //console.log('mock 1', twitterUser);
    const twPoints = await this.getUserTweetPoints({ username });

    let view = twPoints.allTweets.totalViews;
    let like = twPoints.allTweets.totalFavoriteCount;
    let retweet = twPoints.allTweets.totalRetweetCount;
    let reply = twPoints.allTweets.totalReplyCount;


    const userPortfolio = await this.getUserTwitterPortfolio(username);

    //console.log('mock 2', userPortfolio);

    const shillScoresList: number[] = [];

    for (let k = 0; k < userPortfolio.length; k++){

      let ath = (userPortfolio[k].ath - userPortfolio[k].shillPrice) / userPortfolio[k].shillPrice * 100;

      let currentPrice = (userPortfolio[k].currentPrice - userPortfolio[k].shillPrice) / userPortfolio[k].shillPrice * 100;

      const shillScore = await this.calculateShillScoreNewVersion(view, like, retweet, reply, ath, currentPrice);

      shillScoresList.push(shillScore);
    }

    console.log('shill score list',shillScoresList);
    // calculate average shill score
    const total = shillScoresList.reduce((sum, score) => sum + score, 0);
    console.log('total',total);
    let finalScore = Math.floor(total / shillScoresList.length);

    console.log('final score',finalScore);

    //if (finalScore > 9999) finalScore = 9999;
    if (finalScore < 1) finalScore = 1;
    console.log('savePoint:', finalScore);

    twitterUser.twitterPoints = finalScore;

    await this.twitterUsersRep.save(twitterUser);
  }
}
