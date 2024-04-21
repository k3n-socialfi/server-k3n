import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TwitterService } from '../twitter/twitter.service';
import { User } from '../users/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
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
      creator: userId,
      paymentMethod: request.paymentMethod,
      price: request.price
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

  async findPopularJobs() {
    const jobs = await this.jobsRep.find({
      where: {
        rating: 5
      }
    });
    const jobsResponse = jobs.map((job) => {
      const { _id, ...jobData } = job;
      return jobData;
    });
    return jobsResponse;
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

  async getProjectById(id: string) {
    try {
      const call = this.httpService.get(`https://api.coingecko.com/api/v3/coins/${id}`).toPromise();
      const res = (await call)?.data;

      let userTweet = [];
      if (res?.links?.twitter_screen_name) {
        userTweet = (await this.twitterService.getUserTweets({ username: res?.links?.twitter_screen_name })).results;
      }
      const project = {
        name: res?.name,
        description: res?.description?.en,
        image: res?.image?.large,
        categories: res?.categories,
        social: {
          twitter: res?.links?.twitter_screen_name,
          facebook: res?.links?.facebook_username,
          telegram: res?.links?.telegram_channel_identifier,
          github: res?.links?.repos_url?.github
        },
        twitterFollowers: res?.community_data?.twitter_followers,
        contractAddress: res?.contract_address,
        whitePaper: res?.links?.whitepaper,
        website: res?.links?.homepage?.[0],
        projectType: res?.categories?.[0],
        primaryEcosystem: res?.asset_platform_id,
        price: res?.market_data?.current_price?.usd,
        circulatingSupply: res?.market_data?.circulating_supply,
        maxSupply: res?.market_data?.max_supply,
        totalSupply: res?.market_data?.total_supply,
        ath: res?.market_data?.ath?.usd,
        athDate: res?.market_data?.ath_date?.usd,
        volume24h: res?.market_data?.total_volume?.usd,
        marketCap: res?.market_data?.market_cap?.usd,
        marketCapRank: res?.market_data?.market_cap_rank,
        fdv: res?.market_data?.market_cap_fdv_ratio,
        tvl: res?.market_data?.total_value_locked,
        tweets: userTweet?.slice(0, 4)
      };
      return project;
    } catch (err) {
      console.log('err:', err);
      this.logger.error(err?.response?.data?.errors, err.stack, TwitterService.name);
      throw new InternalServerErrorException(err?.response?.data?.errors);
    }
  }

  async getTrendingProjects() {
    try {
      const call = this.httpService.get(`https://api.coingecko.com/api/v3/search/trending`).toPromise();
      const res = (await call)?.data;

      // let userTweet = [];
      // if (res?.links?.twitter_screen_name) {
      //   userTweet = await this.twitterService.getUserTweets({ username: res?.links?.twitter_screen_name });
      // }
      const trending = res?.coins?.map((project) => {
        // console.log('project:', project.items.data);
        // delete project.data;
        const { data, ...projectInfo } = project.item;
        return projectInfo;
      });
      return trending;
    } catch (err) {
      console.log('err:', err);
      this.logger.error(err?.response?.data?.errors, err.stack, TwitterService.name);
      throw new InternalServerErrorException(err?.response?.data?.errors);
    }
  }
}
