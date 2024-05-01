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
export class CreateJobDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @ApiProperty({})
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({})
  @IsString()
  @IsOptional()
  jobType?: string;

  @ApiProperty({})
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  jobDescription?: string;

  @ApiProperty({})
  @IsOptional()
  @IsArray()
  organization?: string[];

  @ApiProperty({})
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({})
  @IsNumber()
  price: number;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({})
  @IsString()
  platform: string;

  @ApiProperty({})
  @IsOptional()
  @IsArray()
  currency?: string[];

  @ApiProperty({})
  @IsString()
  kolWallet: string;

  //   @ApiProperty({})
  //   @IsString()
  //   creator: string;
}
