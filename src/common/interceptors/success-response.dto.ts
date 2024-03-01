import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

// import { RouteResponseDto } from 'src/modules.v1/route/dto/route-response.dto';

export class ResponseDto<T> {
  @ApiProperty({
    example: '0',
    description: 'System code'
  })
  @IsNotEmpty()
  @IsString()
  readonly code: number;

  @ApiProperty({
    example: `success`,
    description: 'Response message'
  })
  @IsNotEmpty()
  @IsString()
  readonly message: string;

  @ApiProperty({})
  readonly data: T;

  @ApiProperty({
    example: `2023-05-02T14:11:23.634Z`,
    description: 'Time'
  })
  @IsNotEmpty()
  @IsString()
  readonly time: string;
}
