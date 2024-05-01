import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TwitterService } from './twitter.service';
import { SwaggerTwitterUserResponseDto } from './dto/response/swagger-response.dto';
import { IsOptional } from 'class-validator';
import { RequestUserTweetQuery } from './dto/request/user-tweet.dto';

@Controller('twitter')
@ApiTags('Twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}
  @Get('/username/:username')
  @ApiResponse({
    description: 'Get twitter user response',
    type: SwaggerTwitterUserResponseDto
  })
  public async getUserByUsername(@Param('username') username: string) {
    return {
      code: 200,
      message: 'Get all user successful',
      data: await this.twitterService.findTwitterUsersByUsername(username)
    };
  }

  @Get(':id')
  @ApiResponse({
    description: 'Get twitter user response',
    type: SwaggerTwitterUserResponseDto
  })
  public async getUserById(@Param('id') id: string) {
    return {
      code: 200,
      message: 'Get all user successful',
      data: await this.twitterService.findTwitterUsersById(id)
    };
  }

  @Get('/following/:username')
  @ApiResponse({
    description: 'Get twitter user following response',
    type: SwaggerTwitterUserResponseDto
  })
  public async getUserFollowing(@Param('username') username: string) {
    return {
      code: 200,
      message: 'Get all user successful',
      data: await this.twitterService.findTwitterUsersFollowing(username)
    };
  }

  @Get('/followers/:username')
  @ApiResponse({
    description: 'Get twitter user following response',
    type: SwaggerTwitterUserResponseDto
  })
  public async getUserFollowers(@Param('username') username: string) {
    return {
      code: 200,
      message: 'Get all user successful',
      data: await this.twitterService.findTwitterUsersFollowers(username)
    };
  }

  @Get('user/tweets')
  public async getUserTweets(@Query(new ValidationPipe({ transform: true })) query: RequestUserTweetQuery) {
    return {
      code: 200,
      message: "Get user's tweets successful",
      data: await this.twitterService.getUserTweets({
        username: query.username,
        userId: query.userId,
        limit: query.limit,
        includePinned: query.includePinned,
        includeReplies: query.includeReplies
      })
    };
  }

  // @Get('user/portfolio')
  // public async getUserTwitterPortfolio(@Query(new ValidationPipe({ transform: true })) query: RequestUserTweetQuery) {
  //   return {
  //     code: 200,
  //     message: "Get user's portfolio successful",
  //     data: await this.twitterService.getUserTwitterPortfolio(query.username)
  //   };
  // }

  @Get('user/portfolio')
  public async getUserTwitterPortfolio(@Query('username') username: string) {
    return {
      code: 200,
      message: "Get user's portfolio successful",
      data: await this.twitterService.getPortfolioByUsername(username)
    };
  }

  @Get('points/:username')
  public async getUserTweetsPoints(@Param('username') username: string) {
    return {
      code: 200,
      message: "Get user's tweets points successful",
      data: await this.twitterService.getUserTweetPoints({ username })
    };
  }
}
