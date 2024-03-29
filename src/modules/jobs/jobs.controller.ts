import { Body, Controller, Get, Param, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { CreateJobDto } from './dto/request/create-job.dto';
import { RequestJobsQuery } from './dto/request/query-jobs.dto';
import { Request } from 'express';

@Controller('jobs')
@ApiTags('Job')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('')
  public async getAllJobs(@Query(new ValidationPipe({ transform: true })) query: RequestJobsQuery) {
    // console.log('req:', req.user)
    let { page, limit } = query;
    page = page ? +page : 0;
    limit = limit ? +limit : 10;
    return {
      code: 200,
      message: 'Get all jobs successful',
      data: await this.jobsService.findAllJobs({
        page,
        limit,
        ...query
      })
    };
  }

  @Get(':jobId')
  //   @ApiResponse({
  //     description: 'Get user by id response',
  //     type: SwaggerUserResponseDto
  //   })
  public async getJobById(@Param('jobId') jobId: string) {
    return {
      code: 200,
      message: 'Get job by id successful',
      data: await this.jobsService.findJobById(jobId)
    };
  }

  @Post('create')
  //   @ApiCreatedResponse({
  //     description: 'Create user by admin response',
  //     type: SwaggerCreateUserByAdminResponseDto
  //   })
  @UseGuards(AccessTokenGuard)
  public async createJob(@Req() req: Request, @Body() request: CreateJobDto) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    return {
      code: 201,
      message: 'Create job by user successful',
      data: await this.jobsService.createJob(userObject.sub, request)
    };
  }
}
