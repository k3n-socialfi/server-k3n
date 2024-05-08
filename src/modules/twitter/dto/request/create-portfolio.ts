import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
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
  @IsOptional()
  @IsString()
  contractAddress?: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  symbol: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  chain: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  firstTweetDate: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  firstTweet: string;
}
