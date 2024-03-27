import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsNumber, ValidateNested, IsObject } from 'class-validator';
import { Column, ObjectId } from 'typeorm';
import { ResponseDto } from '@common/interceptors/success-response.dto';
import { TwitterUserDetailResponseDto } from './user-detail-response.dto';

export abstract class TweetDetailResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tweetId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  creationDate: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  mediaUrl?: string[];

  @ApiProperty()
  videoUrl?: string;

  @Type(() => TwitterUserDetailResponseDto)
  @ApiProperty()
  user: TwitterUserDetailResponseDto;
}
