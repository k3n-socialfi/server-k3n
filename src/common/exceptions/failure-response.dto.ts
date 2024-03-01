import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FailureResponseDto {
  @ApiProperty({
    example: '500',
    description: 'System code'
  })
  @IsNotEmpty()
  @IsString()
  readonly code: number;

  @ApiProperty({
    example: `error message`,
    description: 'Error message'
  })
  readonly message: string | any;

  @ApiProperty({
    example: `/api/v1/check`,
    description: 'Path of the request'
  })
  @IsNotEmpty()
  @IsString()
  readonly path: string;

  @ApiProperty({
    example: `2023-4-3-44598677`,
    description: 'RequestId to trace'
  })
  @IsNotEmpty()
  @IsString()
  readonly requestId: string;

  @ApiProperty({
    example: `2023-05-02T14:11:23.634Z`,
    description: 'Time'
  })
  @IsNotEmpty()
  @IsString()
  readonly time: string;
}
