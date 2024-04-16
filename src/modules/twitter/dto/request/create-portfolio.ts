import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
export class CreateTwitterPortfolioDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  tokenName: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  contractAddress: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  symbol: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  shillPrice: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  firstTweetDate: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  firstTweet: string;
}
