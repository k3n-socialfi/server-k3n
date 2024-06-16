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
export class CreateMessageDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  requestType: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  from: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty({})
  @IsNumber()
  amount: number;

}
