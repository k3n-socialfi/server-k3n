import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TwitterService } from './twitter.service';
import { SwaggerTwitterUserResponseDto } from './dto/response/swagger-response.dto';

@Controller('twitter')
@ApiTags('Twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}
  @Get(':username')
  @ApiResponse({
    description: 'Get twitter user response',
    type: SwaggerTwitterUserResponseDto
  })
  public async getUser(@Param('username') username: string) {
    return {
      code: 200,
      message: 'Get all user successful',
      data: await this.twitterService.findTwitterUsers(username)
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
}
