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
export class UpdateUserByAdminDto {
  @ApiProperty({})
  @IsOptional()
  username?: string;

  @IsOptional()
  fullName?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  phoneNumber?: number;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  bio?: string;

  @IsOptional()
  coverImage?: string;

  @IsOptional()
  dob?: string;

  @IsOptional()
  gender?: string;

  @IsOptional()
  country?: string;
}
