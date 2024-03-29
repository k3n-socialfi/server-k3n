import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TwitterService } from '../twitter/twitter.service';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateJobDto } from './dto/request/create-job.dto';
import { generateId } from 'src/utils/helper';
import { Jobs } from './entities/jobs.entity';
import { RequestJobsQuery } from './dto/request/query-jobs.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class JobsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly twitterService: TwitterService,
    @InjectRepository(Jobs) private jobsRep: Repository<Jobs>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) {}
  async createJob(userId: string, request: CreateJobDto) {
    const jobId = generateId();
    const jobCreated = {
      jobId,
      projectName: request.projectName,
      tags: request.tags,
      jobType: request.jobType,
      isPublic: request.isPublic,
      jobDescription: request.jobDescription,
      organization: request.organization,
      image: request.image,
      creator: userId
    };
    const saveJob = this.jobsRep.create(jobCreated);
    await this.jobsRep.save(saveJob);
    delete saveJob._id;
    return saveJob;
  }

  async findAllJobs(query: RequestJobsQuery) {
    console.log('query:', query);
    const skip = (query.page - 1) * query.limit;

    // query conditions
    const whereConditions: any = {};
    if (query.jobType) {
      whereConditions.jobType = query.jobType;
    }

    if (query.creator) {
      whereConditions.role = query.creator;
    }

    // if (query.tags) {
    //   whereConditions.tags = query.tags;
    // }
    const [jobs, totalCount] = await Promise.all([
      this.jobsRep.find({
        where: whereConditions,
        skip: skip > 0 ? skip : 0,
        take: query.limit,
        order: { createdAt: 'DESC' }
      }),
      this.countDocuments()
    ]);

    const totalPages = Math.ceil(totalCount / query.limit);

    const jobsResponse = jobs.map((job) => {
      const { _id, ...jobData } = job;
      return jobData;
    });

    return {
      jobs: jobsResponse,
      page: query.page,
      pageSize: jobs.length,
      totalPages: totalPages,
      totalItems: totalCount
    };
  }

  async countDocuments(): Promise<number> {
    const count = await this.jobsRep.count();
    return count;
  }

  async findJobById(jobId: string) {
    const job = await this.jobsRep.findOne({
      where: {
        jobId
      }
    });
    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found.`);
    }
    const { _id, ...jobData } = job;
    return jobData;
  }
}
