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
  IsIn
} from 'class-validator';
export class UpdateUserDto {
  @ApiProperty({})
  @IsOptional()
  type?: string;

  @ApiProperty({})
  @IsOptional()
  jobTitle?: string;

  //   @ApiProperty({})
  //   @IsOptional()
  //   organization?: string;

  @ApiProperty({})
  @IsOptional()
  pricePerPost?: number;

  @ApiProperty({})
  @IsOptional()
  fullName?: string;

  @ApiProperty({})
  @IsOptional()
  email?: string;

  @ApiProperty({})
  @IsOptional()
  phoneNumber?: number;

  @ApiProperty({})
  @IsOptional()
  bio?: string;

  @ApiProperty({})
  @IsOptional()
  dob?: string;

  @ApiProperty({})
  @IsOptional()
  gender?: string;

  @ApiProperty({})
  @IsOptional()
  location?: string;
}
