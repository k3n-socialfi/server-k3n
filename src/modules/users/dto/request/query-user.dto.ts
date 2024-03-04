import { PaginationParams } from "@common/dtos/pagination.dto";
import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RequestUserQuery extends PaginationParams {
    @IsOptional()
    @Type(() => String)
    @IsString()
    @ApiProperty({ required: false, default: 'user' })
    role: string;

    @IsOptional()
    @Type(() => String)
    @IsString()
    @ApiProperty({ required: false })
    @ApiProperty()
    username: string;
}