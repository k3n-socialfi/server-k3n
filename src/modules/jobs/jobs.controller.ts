import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { CreateJobDto } from './dto/request/create-job.dto';
import { RequestJobsQuery } from './dto/request/query-jobs.dto';
import { Request } from 'express';
import { AcceptOfferDto } from './dto/request/accept-offer.dto';

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

  @Get('/popular')
  public async getPopularJobs() {
    // console.log('req:', req.user)
    // let { page, limit } = query;
    // page = page ? +page : 0;
    // limit = limit ? +limit : 10;
    return {
      code: 200,
      message: 'Get popular jobs successful',
      data: await this.jobsService.findPopularJobs()
    };
  }

  @Get(':jobId/detail')
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

  @Get('project/:id')
  public async getProjectById(@Param('id') id: string) {
    return {
      code: 200,
      message: 'Get project by id successful',
      data: await this.jobsService.getProjectById(id)
    };
  }

  @Get('trending/projects')
  public async getTrendingProjects() {
    return {
      code: 200,
      message: 'Get trending project successful',
      data: await this.jobsService.getTrendingProjects()
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

  @Post('/:jobId/offer')
  @UseGuards(AccessTokenGuard)
  public async offerJobs(
    @Req() req: Request,
    @Param('jobId') jobId: string
    // @Param('userId') userId: string
  ) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    return {
      code: 201,
      message: 'Offer job successful',
      data: await this.jobsService.offerJobs(userObject?.sub, jobId)
    };
  }

  @Post('offer/accept')
  @UseGuards(AccessTokenGuard)
  public async acceptOffer(@Req() req: Request, @Body() body: AcceptOfferDto) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    return {
      code: 201,
      message: 'Accept offer job successful',
      data: await this.jobsService.acceptOffer(userObject?.sub, body.jobId, body.subscriber)
    };
  }

  @Get('/list-offers')
  @UseGuards(AccessTokenGuard)
  public async getOffers(
    @Req() req: Request
    // @Param('userId') userId: string
  ) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    return {
      code: 201,
      message: 'Get all offer successful',
      data: await this.jobsService.getAllOffer(userObject?.sub)
    };
  }

  @Get('/list-offers/:username')
  // @UseGuards(AccessTokenGuard)
  public async getOffersByUserName(
    // @Req() req: Request
    @Param('username') username: string
  ) {
    // const userObject = JSON.parse(JSON.stringify(req.user));
    return {
      code: 201,
      message: 'Get all offer by username successful',
      data: await this.jobsService.getAllOfferByUsername(username)
    };
  }

  @Put('/:jobId/complete')
  public async completeJob(@Param('jobId') jobId: string) {
    return {
      code: 201,
      message: 'Complete job successful',
      data: await this.jobsService.completeJob(jobId)
    };
  }

  @Get('/my-offers')
  @UseGuards(AccessTokenGuard)
  public async getMyOffer(
    @Req() req: Request
    // @Param('userId') userId: string
  ) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    return {
      code: 201,
      message: 'Get my offer successful',
      data: await this.jobsService.getMyOffer(userObject?.sub)
    };
  }
}
