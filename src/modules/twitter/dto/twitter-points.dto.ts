import { IsNotEmpty } from 'class-validator';

export abstract class TwitterPoints {
  @IsNotEmpty()
  totalFavoriteCount: number;
  @IsNotEmpty()
  totalRetweetCount: number;
  @IsNotEmpty()
  totalReplyCount: number;
  @IsNotEmpty()
  totalQuoteCount: number;
  @IsNotEmpty()
  totalViews: number;
  @IsNotEmpty()
  totalTweets: number;
  @IsNotEmpty()
  totalPoints: number;
}
