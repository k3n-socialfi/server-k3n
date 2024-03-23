import { ResponseDto } from '@common/interceptors/success-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TwitterUserDetailResponseDto } from './user-detail-response.dto';

export class SwaggerTwitterUserResponseDto extends ResponseDto<TwitterUserDetailResponseDto> {
  @ApiProperty({
    example: `{
        "userId": "44196397",
        "username": "elonmusk",
        "name": "Elon Musk",
        "followerCount": 178122964,
        "followingCount": 562,
        "favouritesCount": 46898,
        "isPrivate": null,
        "isVerified": false,
        "isBlueVerified": true,
        "location": "",
        "profilePicUrl": "https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_normal.jpg",
        "profileBannerUrl": "https://pbs.twimg.com/profile_banners/44196397/1690621312",
        "description": "",
        "externalUrl": null,
        "numberOfTweets": 40916,
        "bot": false,
        "timestamp": 1243973549,
        "hasNftAvatar": false,
        "category": null,
        "defaultProfile": false,
        "defaultProfileImage": false,
        "listedCount": 149156,
        "verifiedType": null,
        "creationDate": "Tue Jun 02 20:12:29 +0000 2009"
      }`,
    type: TwitterUserDetailResponseDto
  })
  readonly data: TwitterUserDetailResponseDto;
}
