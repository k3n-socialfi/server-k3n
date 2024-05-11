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
import { UserTags, UserType } from '../../entities/user.entity';
import { Role } from '@common/constants/enum';
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

export class UpdateUserProfileSigUpDto {
  @ApiProperty({})
  @IsOptional()
  isProjectAccount?: boolean;

  @ApiProperty({})
  @IsOptional()
  projectChain?: string;

  @ApiProperty({})
  @IsOptional()
  projectName?: string;

  @ApiProperty({})
  @IsOptional()
  tokenName?: string;

  @ApiProperty({})
  @IsOptional()
  platform?: string;

  @ApiProperty({})
  @Type(() => String)
  @IsOptional()
  role?: Role;

  @ApiProperty({})
  @Type(() => String)
  @IsOptional()
  type?: UserType;

  @ApiProperty({})
  @IsOptional()
  location?: string;

  @ApiProperty({})
  @IsOptional()
  language?: string;

  @ApiProperty({})
  @IsOptional()
  @IsArray()
  tags?: UserTags[];
}
