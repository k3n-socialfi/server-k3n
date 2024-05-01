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
import { UserType } from '../../entities/user.entity';
export class UpdateUserDto {
  @ApiProperty({})
  @Type(() => String)
  @IsOptional()
  type?: UserType;

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
