import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RequestUserTweetQuery {
  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false })
  username: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false })
  @ApiProperty()
  userId: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @ApiProperty()
  limit: number;

  @IsOptional()
  @ApiProperty({ required: false })
  @ApiProperty()
  includeReplies: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  @ApiProperty()
  includePinned: boolean;
}
