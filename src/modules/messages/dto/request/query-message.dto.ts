import { PaginationParams } from '@common/dtos/pagination.dto';
import { IsNumber, Min, IsOptional, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
//import { JobState } from '../../entities/jobs.entity';

export class RequestJobsQuery extends PaginationParams {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  @ApiProperty()
  jobType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  @ApiProperty()
  creator: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, enum: JobState })
  @Type(() => String)
  jobState: JobState;

  //   @IsOptional()
  //   @IsArray()
  //   @ApiProperty({ required: false })
  //   @ApiProperty()
  //   tags: string[];
}
