import { AbstractEntity } from '@common/entities/abstract-entity';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { TwitterPoints } from '../dto/twitter-points.dto';

@Entity('twitter-points')
export class TwPoints extends AbstractEntity {
  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true, default: null })
  changeRanking: number;

  @Column({})
  oneDayTweets: TwitterPoints;

  @Column({})
  threeDayTweets: TwitterPoints;

  @Column({})
  sevenDayTweets: TwitterPoints;

  @Column({})
  allTweets: TwitterPoints;

  @Column({})
  latestTweet: any;

  @BeforeInsert()
  async beforeInsert() {
    if (!this.changeRanking) this.changeRanking = null;

    this.oneDayTweets.totalPoints =
      this.oneDayTweets.totalFavoriteCount * 10 +
      this.oneDayTweets.totalRetweetCount * 10 +
      this.oneDayTweets.totalReplyCount * 30 +
      this.oneDayTweets.totalQuoteCount * 40 +
      this.oneDayTweets.totalViews * 10;

    this.threeDayTweets.totalPoints =
      this.threeDayTweets.totalFavoriteCount * 10 +
      this.threeDayTweets.totalRetweetCount * 10 +
      this.threeDayTweets.totalReplyCount * 30 +
      this.threeDayTweets.totalQuoteCount * 40 +
      this.threeDayTweets.totalViews * 10;

    this.sevenDayTweets.totalPoints =
      this.sevenDayTweets.totalFavoriteCount * 10 +
      this.sevenDayTweets.totalRetweetCount * 10 +
      this.sevenDayTweets.totalReplyCount * 30 +
      this.sevenDayTweets.totalQuoteCount * 40 +
      this.sevenDayTweets.totalViews * 10;

    this.allTweets.totalPoints =
      this.allTweets.totalFavoriteCount * 10 +
      this.allTweets.totalRetweetCount * 10 +
      this.allTweets.totalReplyCount * 30 +
      this.allTweets.totalQuoteCount * 40 +
      this.allTweets.totalViews * 10;
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.oneDayTweets.totalPoints =
      this.oneDayTweets.totalFavoriteCount * 10 +
      this.oneDayTweets.totalRetweetCount * 10 +
      this.oneDayTweets.totalReplyCount * 30 +
      this.oneDayTweets.totalQuoteCount * 40 +
      this.oneDayTweets.totalViews * 10;

    this.threeDayTweets.totalPoints =
      this.threeDayTweets.totalFavoriteCount * 10 +
      this.threeDayTweets.totalRetweetCount * 10 +
      this.threeDayTweets.totalReplyCount * 30 +
      this.threeDayTweets.totalQuoteCount * 40 +
      this.threeDayTweets.totalViews * 10;

    this.sevenDayTweets.totalPoints =
      this.sevenDayTweets.totalFavoriteCount * 10 +
      this.sevenDayTweets.totalRetweetCount * 10 +
      this.sevenDayTweets.totalReplyCount * 30 +
      this.sevenDayTweets.totalQuoteCount * 40 +
      this.sevenDayTweets.totalViews * 10;

    this.allTweets.totalPoints =
      this.allTweets.totalFavoriteCount * 10 +
      this.allTweets.totalRetweetCount * 10 +
      this.allTweets.totalReplyCount * 30 +
      this.allTweets.totalQuoteCount * 40 +
      this.allTweets.totalViews * 10;
  }
}
