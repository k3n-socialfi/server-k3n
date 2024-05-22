import { PaginationParams } from '@common/dtos/pagination.dto';
import { IsNumber, Min, IsOptional, IsString, IsBoolean, Max, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserTags, UserType } from '../../entities/user.entity';
import { Role } from '@common/constants/enum';

export enum ReviewQuery {
  OneTwo = '1-2',
  TwoThree = '2-3',
  ThreeFour = '3-4',
  FourFive = '4-5'
}

export enum FollowerQuery {
  OneTwo = '1k-2k',
  TwoThree = '2k-3k',
  ThreeFour = '3k-4k',
  FourFive = '4k-5k',
  FiveTen = '5k-10k',
  TenTwenty = '10k-20k',
  OverTwenty = '>20k'
}

export enum ShillScoreQuery {
  OneTwo = '100-200',
  TwoThree = '200-300',
  ThreeFour = '300-400',
  FourFive = '400-500',
  FiveSix = '500-600',
  SixSeven = '600-700',
  SevenEight = '700-800',
  EightNine = '800-900',
  OverNine = '>900'
}

export class RequestUserQuery extends PaginationParams {
  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false, enum: Role, default: Role.User })
  role: Role;

  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false })
  username: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false, enum: UserType })
  type?: UserType;

  @IsOptional()
  @Type(() => Boolean)
  @ApiProperty({ required: false })
  // @IsBoolean()
  verification?: Boolean;

  @IsOptional()
  @Type(() => String)
  // @IsArray()
  @ApiProperty({ required: false })
  tags?: UserTags[];

  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false, enum: ReviewQuery })
  review?: ReviewQuery;
}

export class RequestKolsTrending extends PaginationParams {
  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false, enum: UserType })
  type?: UserType;

  // @IsOptional()
  // @Type(() => Boolean)
  // @ApiProperty({ required: false })
  // @IsBoolean()
  // verification?: boolean;

  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  // @Min(0)
  // @ApiProperty({ required: false, default: 0 })
  // lowerLimit?: number;

  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  // @Max(10000000)
  // @ApiProperty({ required: false, default: 10000000 })
  // upperLimit?: number;

  // @IsOptional()
  // @IsArray()
  // @ApiProperty({ required: false })
  // tags?: string[];

  // @IsOptional()
  // @Type(() => String)
  // @IsString()
  // @ApiProperty({ required: false })
  // review?: string;
}

export class RequestKolsRanking extends PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: true, default: 100 })
  top: number;

  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false, enum: UserType })
  type?: UserType;

  @IsOptional()
  @Type(() => Boolean)
  @ApiProperty({ required: false })
  // @IsBoolean()
  verification?: Boolean;

  @IsOptional()
  @Type(() => String)
  // @IsArray()
  @ApiProperty({ required: false })
  tags?: UserTags[];

  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false, enum: ReviewQuery })
  review?: ReviewQuery;

  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false, enum: FollowerQuery })
  follower?: FollowerQuery;

  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false, enum: ShillScoreQuery })
  shillScore?: ShillScoreQuery;

  @IsOptional()
  @Type(() => String)
  // @IsArray()
  @ApiProperty({ required: false })
  mentionedProject?: string;
}
