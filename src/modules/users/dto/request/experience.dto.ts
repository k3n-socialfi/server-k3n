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
export class CreateUserExperienceDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  employmentType?: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  locationType?: string;

  @ApiProperty({})
  @IsOptional()
  @IsBoolean()
  currentlyWorking?: boolean;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  startDate: number;

  @ApiProperty({})
  @IsOptional()
  @IsNumber()
  endDate?: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  industry: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  media?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  projectName?: string;

  @ApiProperty({})
  @IsOptional()
  @IsArray()
  skill?: string[];
}

export class UpdateUserExperienceDto {
  @ApiProperty({})
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  employmentType?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  locationType?: string;

  @ApiProperty({})
  @IsOptional()
  @IsBoolean()
  currentlyWorking?: boolean;

  @ApiProperty({})
  @IsOptional()
  @IsNumber()
  startDate?: number;

  @ApiProperty({})
  @IsOptional()
  @IsNumber()
  endDate?: number;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  media?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  projectName?: string;

  @ApiProperty({})
  @IsArray()
  @IsOptional()
  skill?: string[];
}
