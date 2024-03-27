import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';
export class ConnectTwitterDto {
  @ApiProperty({
    example: '1772217497644581200',
    description: 'Tweet ID ',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  tweetId: string;
}
