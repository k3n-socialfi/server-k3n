import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsNumber,
  IsArray,
  ArrayMinSize,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsStrongPassword,
  IsIn,
  Min,
  Max
} from 'class-validator';
export class AcceptOfferDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  creator: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  jobId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  subscriber: string;
}
