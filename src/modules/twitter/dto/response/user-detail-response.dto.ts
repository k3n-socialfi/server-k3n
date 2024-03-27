import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsNumber, ValidateNested, IsObject } from 'class-validator';
import { Column, ObjectId } from 'typeorm';
import { ResponseDto } from '@common/interceptors/success-response.dto';

export abstract class TwitterUserDetailResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  followerCount?: number;

  @ApiProperty()
  followingCount?: number;

  @ApiProperty()
  favouritesCount?: string;

  @ApiProperty()
  isPrivate?: boolean;

  @ApiProperty()
  isVerified?: boolean;

  @ApiProperty()
  isBlueVerified?: boolean;

  @ApiProperty()
  location?: string;

  @ApiProperty()
  profilePicUrl?: string;

  @ApiProperty()
  profileBannerUrl?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  externalUrl?: any;

  @ApiProperty()
  numberOfTweets?: string;

  @ApiProperty()
  bot?: boolean;

  @ApiProperty()
  timestamp?: number;

  @ApiProperty()
  hasNftAvatar?: boolean;

  @ApiProperty()
  category?: string;

  @ApiProperty()
  defaultProfile?: boolean;

  @ApiProperty()
  defaultProfileImage?: boolean;

  @ApiProperty()
  listedCount?: number;

  @ApiProperty()
  verifiedType?: any;

  @ApiProperty()
  creationDate?: string;
}
