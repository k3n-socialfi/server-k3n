import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationParams {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @ApiProperty({ required: false, default: 0 })
    page: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @ApiProperty({ required: false, default: 10 })
    @ApiProperty()
    limit: number;
}