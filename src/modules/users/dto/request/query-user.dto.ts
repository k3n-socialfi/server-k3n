import { PaginationParams } from '@common/dtos/pagination.dto';
import { IsNumber, Min, IsOptional, IsString, IsBoolean, Max, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserTags, UserType } from '../../entities/user.entity';
import { Role } from '@common/constants/enum';

export class RequestUserQuery extends PaginationParams {
  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false, enum: Role, default: Role.User })
  role: Role;

  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false })
  username: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false, enum: UserType })
  type: UserType;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @ApiProperty({ required: false })
  verification: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ required: false, default: 0 })
  lowerLimit: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(10000000)
  @ApiProperty({ required: false, default: 10000000 })
  upperLimit: number;
}

export class RequestKolsTrending extends PaginationParams {
  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false, enum: UserType })
  type?: UserType;

  // @IsOptional()
  // @Type(() => Boolean)
  // @ApiProperty({ required: false })
  // @IsBoolean()
  // verification?: boolean;

  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  // @Min(0)
  // @ApiProperty({ required: false, default: 0 })
  // lowerLimit?: number;

  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  // @Max(10000000)
  // @ApiProperty({ required: false, default: 10000000 })
  // upperLimit?: number;

  // @IsOptional()
  // @IsArray()
  // @ApiProperty({ required: false })
  // tags?: string[];

  // @IsOptional()
  // @Type(() => String)
  // @IsString()
  // @ApiProperty({ required: false })
  // review?: string;
}

export class RequestKolsRanking {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: false, default: 100 })
  top: number;

  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ required: false, enum: UserType })
  type?: UserType;

  @IsOptional()
  @Type(() => Boolean)
  @ApiProperty({ required: false })
  // @IsBoolean()
  verification?: Boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ required: false, default: 0 })
  lowerLimit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(10000000)
  @ApiProperty({ required: false, default: 10000000 })
  upperLimit?: number;

  @IsOptional()
  @Type(() => String)
  // @IsArray()
  @ApiProperty({ required: false })
  tags?: UserTags[] | UserTags;

  @IsOptional()
  @Type(() => Number)
  @IsString()
  @ApiProperty({ required: false })
  review?: number;
}
