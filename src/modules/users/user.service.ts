import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, Repository } from 'typeorm';
import { BlockchainWallet, JobTittle, SocialNetwork, User, UserTags, UserType } from './entities/user.entity';
import { CreateUserByAdminDto, CreateUserWithTwitterDto, CreateUserWithWalletDto } from './dto/request/create-user.dto';
import { ErrorsCodes, ErrorsMap } from '@common/constants/respond-errors';
import { InternalUserResponseDto, UserListResponseDto, UserResponseDto } from './dto/response/user-response.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Role } from '@common/constants/enum';
import { DateQuery, RequestKolsRanking, RequestKolsTrending, RequestUserQuery } from './dto/request/query-user.dto';
import { UpdateUserByAdminDto } from './dto/request/admin-update-user.dto';
import { TwitterService } from '../twitter/twitter.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { verifySignature } from 'src/utils/verify-signature/solana-signature';
import { generateId } from 'src/utils/helper';
import { TwitterUsers } from './entities/twitter-user.entity';
import { CreateUserExperienceDto, UpdateUserExperienceDto } from './dto/request/experience.dto';
import { UserExperiences } from './entities/experience.entity';
import { UpdateUserDto, UpdateUserProfileSigUpDto } from './dto/request/update-user.dto';
import { Timeout } from '@nestjs/schedule';
import { listUser } from './dto/request/import-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => TwitterService))
    private readonly twitterService: TwitterService,
    @InjectRepository(User) private userRep: MongoRepository<User>,
    @InjectRepository(UserExperiences) private userExperienceRep: MongoRepository<UserExperiences>,
    @InjectRepository(TwitterUsers) private twitterUsersRep: MongoRepository<TwitterUsers>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) {}

  // @Timeout(0)
  async initUser() {
    // this.findAll();
    console.log('Start run user init job !');
    // const listUser = ['Ozi_Eth7'];
    try {
      for (let i = 0; i < listUser.length; i++) {
        console.log('i:', i);
        console.log('listUser[i]:', listUser[i]);
        const twUser = await this.twitterService.findTwitterUsersByUsername(listUser[i]);

        if (!twUser || !twUser?.user_id || !twUser.username) continue;
        const user = await this.userRep.findOne({
          where: {
            userId: twUser.user_id
          }
        });
        if (user) continue;
        // console.log('twUser:', twUser);
        const userTypes = Object.values(UserType);
        const randomUserType = userTypes[Math.floor(Math.random() * userTypes.length)];
        const jobTile = Object.values(JobTittle);
        const randomJob = Math.floor(Math.random() * jobTile.length);
        const tags = Object.values(UserTags);
        const randomNumber = Math.floor(Math.random() * tags.length);
        const randomTags = [tags[randomNumber], tags[randomNumber + 1], tags[randomNumber + 2]];
        const randomReview = Math.random() + 4;
        // Fix to one decimal place
        const review = Number(randomReview.toFixed(1));
        // const price = Number((Math.random() * 5000).toFixed(0));

        const platforms = ['X', 'Facebook', 'TikTok', 'Telegram'];
        const randomPlatforms = Math.floor(Math.random() * platforms.length);

        const social = new SocialNetwork();
        social.social = 'twitter';
        social.username = listUser[i];
        const userCreated = {
          userId: twUser.user_id,
          username: twUser.username,
          password: null,
          fullName: twUser?.name,
          avatar: twUser?.profile_pic_url,
          coverImage: twUser?.profile_banner_url,
          bio: twUser?.description,
          role: Role.User,
          socialProfiles: [social],
          type: randomUserType,
          jobTittle: jobTile[randomJob],
          tags: randomTags,
          review: review,
          isProjectAccount: false,
          platform: platforms[randomPlatforms],
          location: 'England',

          isUpdated: true
          // price: price
        };
        const saveUser = this.userRep.create(userCreated);
        console.log('saveUser:', saveUser);
        const twitterUserCreated = {
          userId: twUser.user_id,
          username: twUser.username,
          fullName: twUser?.name,
          avatar: twUser?.profile_pic_url,
          coverImage: twUser?.profile_banner_url,
          bio: twUser?.description,
          verificationStatus: twUser?.is_blue_verified,
          followers: twUser?.follower_count,
          following: twUser?.following_count,
          externalUrl: twUser?.external_url,
          numberOfTweets: twUser?.number_of_tweets,
          creationDate: twUser?.creation_date
        };
        const saveTwitterUser = this.twitterUsersRep.create(twitterUserCreated);
        await Promise.all([this.userRep.save(saveUser), this.twitterUsersRep.save(saveTwitterUser)]);
      }
      console.log('End run user init job !');
    } catch (err) {
      console.log('err:', err);
    }
  }

  // @Timeout(0)
  async updateTags() {
    const users = await this.userRep.find();
    try {
      await Promise.all(
        users.map(async (user) => {
          // random
          const userTypes = Object.values(UserType);
          const randomUserType = userTypes[Math.floor(Math.random() * userTypes.length)];

          const jobTittle = Object.values(JobTittle);
          const randomJob = jobTittle[Math.floor(Math.random() * jobTittle.length)];

          const tags = Object.values(UserTags);
          const randomNumber = Math.floor(Math.random() * tags.length);
          const randomTags = [tags[randomNumber], tags[randomNumber + 1], tags[randomNumber + 2]];

          const randomReview = Math.random() + 4;
          // Fix to one decimal place
          const review = Number(randomReview.toFixed(1));

          console.log('user:', user.username);
          if (!user.tags) user.tags = randomTags;
          if (!user.jobTittle) user.jobTittle = randomJob;
          if (!user.type) user.type = randomUserType;
          if (user.review < 4 || user.review > 5) user.review = review;
          await this.userRep.update({ userId: user.userId }, user);
        })
      );
    } catch (err) {
      console.log('err:', err);
    }
  }

  // @Timeout(0)
  // async deleteReCord() {
  //   const id = '66255f9789bcfa017427c561';
  //   console.log('id:', id);
  //   const results = await this.userRep
  //     .createQueryBuilder()
  //     .delete()
  //     .where('_id > :id', { id }) // Assuming id is a string representing ObjectId
  //     .execute();
  // }

  async findAllUsers(query: RequestUserQuery): Promise<UserListResponseDto> {
    const skip = query.page * query.limit;

    const tagsQuery: any = typeof query.tags === 'string' ? [query.tags] : query.tags;
    // query conditions
    const whereConditions: any = {};

    if (query.username) {
      whereConditions.username = query.username;
    }

    if (query.role) {
      whereConditions.role = query.role;
    }

    if (query.type) {
      whereConditions.type = { $eq: query.type };
    }

    if (query.verification) {
      whereConditions['twitterInfo.verificationStatus'] = query.verification;
    }

    if (tagsQuery) {
      whereConditions.tags = { $in: tagsQuery };
    }

    if (query.review) {
      let review = query.review.split('-').map(Number);
      whereConditions.review = { $gte: review[0], $lte: review[1] };
    }

    const aggregationPipeline = [
      {
        $lookup: {
          from: 'twitter-users',
          localField: 'userId',
          foreignField: 'userId',
          as: 'twitterInfo'
        }
      },
      { $unwind: '$twitterInfo' },
      {
        $match: whereConditions
      },
      {
        $project: {
          _id: 0,
          password: 0,
          'twitterInfo._id': 0
        }
      },
      // { $sort: { 'twitterInfo.totalPoints': -1 } },
      { $skip: skip > 0 ? skip : 0 },
      { $limit: query.limit }
    ];

    const [users, totalCount] = await Promise.all([
      this.userRep.aggregate(aggregationPipeline).toArray(),
      this.countDocuments()
    ]);

    const totalPages = Math.ceil(totalCount / query.limit);

    // const userResponse: UserResponseDto[] = await Promise.all(
    //   users.map(async (user) => {
    //     const twitterUser = await this.twitterUsersRep.findOne({ where: { userId: user.userId } });
    //     // if (
    //     //   twitterUser.followers < lowerLimit ||
    //     //   (twitterUser.followers > upperLimit || twitterUser.verificationStatus)
    //     // )
    //     // return;
    //     const userExperience = await this.userExperienceRep.find({ where: { userId: user.userId } });
    //     const { password, _id, ...userData } = user;
    //     const image = twitterUser.avatar.replace('normal', '400x400');
    //     userData.twitterInfo = {
    //       twitterPoints: twitterUser.twitterPoints,
    //       royaltyPoints: twitterUser.royaltyPoints,
    //       totalPoints: twitterUser.totalPoints,
    //       avatar: image,
    //       coverImage: twitterUser.coverImage,
    //       verificationStatus: twitterUser.verificationStatus,
    //       followers: twitterUser.followers,
    //       following: twitterUser.following,
    //       externalUrl: twitterUser.externalUrl,
    //       numberOfTweets: twitterUser.numberOfTweets,
    //       creationDate: twitterUser.creationDate
    //     };
    //     userData.experience = userExperience;

    //     return userData;
    //   })
    // );

    return {
      users: users,
      page: query.page,
      pageSize: users.length,
      totalPages: totalPages,
      totalItems: totalCount
    };
  }

  async findAll() {
    const user = await this.userRep.find();
    // const username = await Promise.all([
    //   user.map((u) => {
    //     return u.username;
    //   })
    // ]);
    // console.log('username:', username);
    return user;
  }

  async findKolsTrending(query: RequestKolsTrending) {
    if (query.date == DateQuery.OneDay) query.page = 3;
    else if (query.date == DateQuery.SevenDays) query.page = 4;
    else query.page = 5;
    const skip = query.page * query.limit;

    // query conditions
    const whereConditions: any = {};
    if (query.type) {
      whereConditions.type = { $eq: query.type };
    }

    const aggregationPipeline = [
      {
        $lookup: {
          from: 'twitter-users',
          localField: 'userId',
          foreignField: 'userId',
          as: 'twitterInfo'
        }
      },
      { $unwind: '$twitterInfo' },
      {
        $match: whereConditions
      },
      {
        $project: {
          _id: 0,
          password: 0,
          'twitterInfo._id': 0
        }
      },
      { $sort: { 'twitterInfo.totalPoints': -1 } },
      { $skip: skip > 0 ? skip : 0 },
      { $limit: query.limit }
    ];

    const [users, totalCount] = await Promise.all([
      this.userRep.aggregate(aggregationPipeline).toArray(),
      this.countDocuments()
    ]);

    const totalPages = Math.ceil(totalCount / query.limit);

    return {
      users: users,
      page: query.page,
      pageSize: users.length,
      totalPages: totalPages,
      totalItems: totalCount
    };
  }

  async findTopKolsRanking(query: RequestKolsRanking) {
    console.log('query:', query);
    const skip = query.page * query.limit;

    const tagsQuery: any = typeof query.tags === 'string' ? [query.tags] : query.tags;

    const whereConditions: any = {};

    if (query.type) {
      whereConditions.type = { $eq: query.type };
    }

    if (query.verification) {
      whereConditions['twitterInfo.verificationStatus'] = query.verification;
    }

    if (tagsQuery) {
      whereConditions.tags = { $in: tagsQuery };
    }

    if (query.review) {
      let review = query.review.split('-').map(Number);
      whereConditions.review = { $gte: review[0], $lte: review[1] };
    }

    if (query.minFollower || query.maxFollower) {
      let minFollower = query.minFollower ? query.minFollower : 0;
      let maxFollower = query.maxFollower ? query.maxFollower : 10000000;
      if (minFollower > maxFollower) throw new BadRequestException('maxFollower must be greater then minFollower');
      whereConditions['twitterInfo.followers'] = { $gte: minFollower, $lte: maxFollower };
    }

    if (query.minShillScore || query.maxShillScore) {
      let minShillScore = query.minShillScore ? query.minShillScore : 0;
      let maxShillScore = query.maxShillScore ? query.maxShillScore : 10000000;
      if (minShillScore > maxShillScore)
        throw new BadRequestException('minShillScore must be greater then maxShillScore');
      whereConditions['twitterInfo.totalPoints'] = { $gte: minShillScore, $lte: maxShillScore };
    }

    if (query.mentionedProject) {
      whereConditions['$or'] = [
        { 'mentionedProject.tokenName': query.mentionedProject },
        { 'mentionedProject.symbol': query.mentionedProject }
      ];
    }

    const aggregationPipeline = [
      {
        $lookup: {
          from: 'twitter-users',
          localField: 'userId',
          foreignField: 'userId',
          as: 'twitterInfo'
        }
      },
      { $unwind: '$twitterInfo' },
      {
        $lookup: {
          from: 'twitter-portfolio',
          localField: 'userId',
          foreignField: 'userId',
          as: 'mentionedProject'
        }
      },
      { $unwind: '$mentionedProject' },

      {
        $match: whereConditions
      },
      {
        $project: {
          _id: 0,
          password: 0,
          'twitterInfo._id': 0,
          'mentionedProject._id': 0,
          'mentionedProject.userId': 0
        }
      },
      { $sort: { 'twitterInfo.totalPoints': -1 } },
      { $skip: skip > 0 ? skip : 0 },
      { $limit: query.limit > query.top ? query.top : query.limit }
    ];

    const users = await this.userRep.aggregate(aggregationPipeline).toArray();

    // const userWithPort = await Promise.all(
    //   users.map(async (user) => {
    //     const port = await this.twitterService.getMentionedProject(user.userId);
    //     return {
    //       ...user,
    //       mentionedProject: port
    //     };
    //   })
    // );
    // console.log('userWithPort:', userWithPort);
    const totalPages = Math.ceil(query.top / query.limit);
    return {
      users: users,
      page: query.page,
      pageSize: users.length,
      totalPages: totalPages,
      totalItems: query.top
    };
  }

  async findInternalByUsername(username: string): Promise<InternalUserResponseDto> {
    const user = await this.userRep.findOne({
      where: {
        username: username
      }
    });
    return user;
  }

  async checkExistsAddress(address: string): Promise<boolean> {
    const users = await this.userRep.find({});
    const userWithAddress = users?.find((user) =>
      user.wallets?.find((wallet) => wallet.address.toLowerCase() === address.toLowerCase())
    );
    if (!userWithAddress) {
      return false;
    }
    return true;
  }

  async findByUserId(userId: string): Promise<UserResponseDto> {
    const user = await this.userRep.findOne({
      where: {
        userId
      }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    try {
      const twitterUser = await this.twitterUsersRep.findOne({ where: { userId: user.userId } });
      const userExperience = await this.userExperienceRep.find({ where: { userId: user.userId } });
      const { password, _id, ...userData } = user;
      userData.twitterInfo = {
        twitterPoints: twitterUser.twitterPoints,
        royaltyPoints: twitterUser.royaltyPoints,
        totalPoints: twitterUser.totalPoints,
        avatar: twitterUser.avatar,
        coverImage: twitterUser.coverImage,
        verificationStatus: twitterUser.verificationStatus,
        followers: twitterUser.followers,
        following: twitterUser.following,
        externalUrl: twitterUser.externalUrl,
        numberOfTweets: twitterUser.numberOfTweets,
        creationDate: twitterUser.creationDate
      };
      userData.experience = userExperience;
      return userData;
    } catch (err) {
      console.log('err:', err);
    }
  }

  async findProfileByUsername(username: string) {
    const user = await this.userRep.findOne({
      where: {
        username
      }
    });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found.`);
    }
    let [twitterUser, userExperience] = await Promise.all([
      this.twitterUsersRep.findOne({ where: { userId: user.userId } }),
      this.userExperienceRep.find({ where: { userId: user.userId } })
    ]);
    // let userTweet = await this.twitterService.getUserTweets({ username });
    let userTweet = undefined;
    const { password, _id, ...userData } = user;
    userData.twitterInfo = {
      twitterPoints: twitterUser.twitterPoints,
      royaltyPoints: twitterUser.royaltyPoints,
      totalPoints: twitterUser.totalPoints,
      avatar: twitterUser.avatar,
      coverImage: twitterUser.coverImage,
      verificationStatus: twitterUser.verificationStatus,
      followers: twitterUser.followers,
      following: twitterUser.following,
      externalUrl: twitterUser.externalUrl,
      numberOfTweets: twitterUser.numberOfTweets,
      creationDate: twitterUser.creationDate
    };
    userData.experience = userExperience;

    // let userTweet = [];
    // const usernameTwitter = user.socialProfiles.find((social) => social.social === 'twitter');
    // if (usernameTwitter) {
    //   userTweet = await this.twitterService.getUserTweets({ username: usernameTwitter.username });
    // }
    let userTweets = [];
    if (userTweet && userTweet?.results) userTweets = userTweet.results;
    // console.log('userTweet.results:', userTweet.results);
    return {
      ...userData,
      posts: userTweets.slice(0, 4)
    };
  }

  async getTwitterUserPost(username: string) {
    const user = await this.userRep.findOne({
      where: {
        username
      }
    });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found.`);
    }
    let userTweets = await this.twitterService.getUserTweets({ username });
    let userPosts = [];
    if (userTweets && userTweets?.results) userPosts = userTweets.results;
    return {
      username,
      posts: userPosts.slice(0, 5)
    };
  }

  async findByUserName(username: string): Promise<UserResponseDto> {
    const user = await this.userRep.findOne({
      where: {
        username: username
      }
    });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found.`);
    }
    const twitterUser = await this.twitterUsersRep.findOne({ where: { userId: user.userId } });
    const userExperience = await this.userExperienceRep.find({ where: { userId: user.userId } });
    const { password, _id, ...userData } = user;
    userData.twitterInfo = {
      twitterPoints: twitterUser.twitterPoints,
      royaltyPoints: twitterUser.royaltyPoints,
      totalPoints: twitterUser.totalPoints,
      avatar: twitterUser.avatar,
      coverImage: twitterUser.coverImage,
      verificationStatus: twitterUser.verificationStatus,
      followers: twitterUser.followers,
      following: twitterUser.following,
      externalUrl: twitterUser.externalUrl,
      numberOfTweets: twitterUser.numberOfTweets,
      creationDate: twitterUser.creationDate
    };
    userData.experience = userExperience;
    return userData;
  }

  async findByUserAddress(address: string): Promise<UserResponseDto> {
    try {
      const users = await this.userRep.find({});
      const userWithAddress = users?.find((user) =>
        user.wallets?.find((wallet) => wallet.address.toLowerCase() === address.toLowerCase())
      );
      return userWithAddress;
    } catch (err) {
      console.log('err:', err);
      throw err;
    }
  }

  async findByTwitterId(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRep.findOne({
        where: {
          userId: id
        }
      });
      return user;
    } catch (err) {
      console.log('err:', err);
      throw err;
    }
  }

  async countDocuments(): Promise<number> {
    const count = await this.userRep.count();
    return count;
  }

  async createUser(request: CreateUserByAdminDto): Promise<UserResponseDto> {
    const { username, email, password, role } = request;
    const users = await this.userRep.find({
      where: {
        username: username,
        email: email
      }
    });
    if (!users || users.length == 0) {
      const userId = generateId();
      const userCreated = {
        userId: userId,
        username,
        role: role || Role.User,
        email: email,
        password
      };
      const saveUser = this.userRep.create(userCreated);
      await this.userRep.save(saveUser);
      delete saveUser.password;
      delete saveUser._id;
      return saveUser;
    } else {
      console.log('User has been created wallet!');
      throw new BadRequestException(ErrorsMap[ErrorsCodes.ALREADY_EXISTS]);
    }
  }

  async createUserWithWallet(request: CreateUserWithWalletDto): Promise<UserResponseDto> {
    const { username, password, address } = request;
    const wallet = new BlockchainWallet();
    wallet.chainId = 1;
    wallet.address = address.toLowerCase();
    const userId = generateId();
    const userCreated = {
      userId,
      username,
      password,
      role: Role.User,
      wallets: [wallet]
    };
    const saveUser = this.userRep.create(userCreated);
    await this.userRep.save(saveUser);
    delete saveUser.password;
    delete saveUser._id;
    return saveUser;
  }

  async createUserWithTwitter(request: CreateUserWithTwitterDto): Promise<UserResponseDto> {
    //
    // random
    const userTypes = Object.values(UserType);
    const randomUserType = userTypes[Math.floor(Math.random() * userTypes.length)];

    const jobTittle = Object.values(JobTittle);
    const randomJob = jobTittle[Math.floor(Math.random() * jobTittle.length)];

    const tags = Object.values(UserTags);
    const randomNumber = Math.floor(Math.random() * tags.length);
    const randomTags = [tags[randomNumber], tags[randomNumber + 1], tags[randomNumber + 2]];

    const randomReview = Math.random() * 5;
    const review = Number(randomReview.toFixed(1));
    ///
    const { id, username, password } = request;
    const twUser = await this.twitterService.findTwitterUsersById(id);
    const social = new SocialNetwork();
    social.social = 'twitter';
    social.username = username;

    const userCreated = {
      userId: id,
      username,
      password,
      fullName: twUser?.name,
      avatar: twUser?.profile_pic_url,
      coverImage: twUser?.profile_banner_url,
      bio: twUser?.description,
      role: Role.User,
      socialProfiles: [social],
      tags: randomTags,
      jobTittle: randomJob,
      type: randomUserType,
      review: review
    };
    const saveUser = this.userRep.create(userCreated);
    const image = twUser?.profile_pic_url.replace('normal', '400x400');
    const twitterUserCreated = {
      userId: id,
      username,
      fullName: twUser?.name,
      avatar: image,
      coverImage: twUser?.profile_banner_url,
      bio: twUser?.description,
      verificationStatus: twUser?.is_blue_verified,
      followers: twUser?.follower_count,
      following: twUser?.following_count,
      externalUrl: twUser?.external_url,
      numberOfTweets: twUser?.number_of_tweets,
      creationDate: twUser?.creation_date
    };
    const saveTwitterUser = this.twitterUsersRep.create(twitterUserCreated);

    await Promise.all([this.userRep.save(saveUser), this.twitterUsersRep.save(saveTwitterUser)]);

    delete saveUser.password;
    delete saveUser._id;
    saveUser.twitterInfo = {
      twitterPoints: saveTwitterUser.twitterPoints,
      royaltyPoints: saveTwitterUser.royaltyPoints,
      totalPoints: saveTwitterUser.totalPoints,
      avatar: saveTwitterUser.avatar,
      coverImage: saveTwitterUser.coverImage,
      verificationStatus: saveTwitterUser.verificationStatus,
      followers: saveTwitterUser.followers,
      following: saveTwitterUser.following,
      externalUrl: saveTwitterUser.externalUrl,
      numberOfTweets: saveTwitterUser.numberOfTweets,
      creationDate: saveTwitterUser.creationDate
    };

    await this.twitterService.twitterPointsCalculationByUsername(username);
    return saveUser;
  }

  async updateUserByAdmin(userId: string, request: UpdateUserByAdminDto): Promise<UserResponseDto> {
    const { role } = request;
    let users = await this.findByUserId(userId);
    if (role) users.role = role;
    await this.userRep.save(users);
    return users;
  }

  async updateProfileByUser(userId: string, request: UpdateUserDto): Promise<UserResponseDto> {
    const {
      type,
      jobTitle,
      //organization,
      pricePerPost,
      fullName,
      email,
      phoneNumber,
      bio,
      dob,
      gender,
      location
    } = request;
    let users = await this.findByUserId(userId);

    if (type) users.type = type;
    if (jobTitle) users.jobTitle = jobTitle;
    if (pricePerPost) users.pricePerPost = pricePerPost;
    if (fullName) users.fullName = fullName;
    if (email) users.email = email;
    if (phoneNumber) users.phoneNumber = phoneNumber;
    if (bio) users.bio = bio;
    if (dob) users.dob = dob;
    if (gender) users.gender = gender;
    if (location) users.location = location;
    const { twitterInfo, experience, ...saveData } = users;
    await this.userRep.update({ userId }, saveData);
    return users;
  }

  async updateProfileSigUp(userId: string, request: UpdateUserProfileSigUpDto): Promise<UserResponseDto> {
    const { isProjectAccount, projectChain, projectName, platform, type, location, role, language, tags } = request;
    let users = await this.findByUserId(userId);

    console.log('users.isUpdated:', users.isUpdated);
    if (users?.isUpdated) throw new BadRequestException('You already update profile after signup');
    if (isProjectAccount) users.isProjectAccount = isProjectAccount;
    if (projectChain) users.projectChain = projectChain;
    if (projectName) users.projectName = projectName;
    if (platform) users.platform = platform;
    if (type) users.type = type;
    if (location) users.location = location;
    if (role) users.role = role;
    if (tags) users.tags = tags;

    users.isUpdated = true;
    const { twitterInfo, experience, ...saveData } = users;
    await this.userRep.update({ userId }, saveData);
    return users;
  }

  async connectTwitter(username: string, tweetId: string) {
    let [tweetDetail, user] = await Promise.all([
      this.twitterService.getTweetDetail(tweetId),
      await this.userRep.findOne({
        where: {
          username
        }
      })
    ]);

    const createdTweet = new Date(tweetDetail.creation_date).getTime(); // to ms

    // if Tweet be created before 1 hour => revert
    if (Date.now() - createdTweet > 3600000) {
      throw new BadRequestException('Tweet is out of date. Please try again with another tweet');
    }
    const twUsername = await this.findByTwitterId(tweetDetail.user.id);

    // Check the user in the text
    if (tweetDetail.text.indexOf(user.userId.toString()) !== -1) {
      const checkConnected = user.socialProfiles?.some((social) => social.social === 'twitter');
      if (checkConnected) throw new BadRequestException('Your account already connecting with Twitter');
      if (twUsername) {
        throw new BadRequestException('Twitter already connect another account');
      }
      const social = new SocialNetwork();
      social.social = 'twitter';
      social.username = tweetDetail.user.username.toLowerCase();
      if (user.socialProfiles) {
        user.socialProfiles.push(social);
      } else {
        user.socialProfiles = [social];
      }
      await this.userRep.save(user);
    } else {
      throw new BadRequestException('Verify fail. Please try again');
    }
  }

  async connectWalletSolana(username: string, address: string, signature: string) {
    const message = await this.cacheManager.get(`${address.toLowerCase()}`);
    if (!message) throw new NotFoundException('Sign message not found!. Please try again');
    const verified = verifySignature(message.toString(), signature, address);
    if (!verified) throw new ForbiddenException('Access Denied');
    let [userExists, user] = await Promise.all([
      await this.findByUserAddress(address),
      await this.userRep.findOne({
        where: {
          username
        }
      })
    ]);
    if (userExists) {
      throw new BadRequestException('Address already connect another account');
    } else {
      const wallet = new BlockchainWallet();
      wallet.chainId = 1;
      wallet.address = address.toLowerCase();
      if (user.wallets) {
        user.wallets.push(wallet);
      } else {
        user.wallets = [wallet];
      }
      await this.userRep.save(user);
    }
  }

  // async updateUserPoints(username: string) {
  //   const user = await this.findByUserName(username);
  //   const twitterInfo = user.socialProfiles?.find((social) => social.social === 'twitter');

  //   let twitterPoints = 0;
  //   if (twitterInfo) {
  //     const twPoints = await this.twitterService.getUserTweetPoints({ username: twitterInfo.username });
  //     // console.log('twPoints:', twPoints);

  //     twitterPoints =
  //       twPoints.allTweets.totalFavoriteCount +
  //       twPoints.allTweets.totalRetweetCount * 2 +
  //       twPoints.allTweets.totalReplyCount * 2 +
  //       twPoints.allTweets.totalQuoteCount * 3 +
  //       twPoints.allTweets.totalViews +
  //       twPoints.latestTweet.favoriteCount +
  //       twPoints.latestTweet.retweetCount * 2 +
  //       twPoints.latestTweet.replyCount * 2 +
  //       twPoints.latestTweet.quoteCount * 3 +
  //       twPoints.latestTweet.views;
  //   }

  //   const royaltyPoints = user.royaltyPoints;

  //   user.twitterPoints = twitterPoints;
  //   // user.royaltyPoints = royaltyPoints;

  //   await this.userRep.save(user);

  //   return {
  //     twitterPoints,
  //     royaltyPoints
  //   };
  // }

  // async updateUser(userId: string, request: )

  async createUserExperience(userId: string, request: CreateUserExperienceDto) {
    const {
      title,
      employmentType,
      companyName,
      location,
      locationType,
      currentlyWorking,
      startDate,
      endDate,
      industry,
      description,
      media,
      projectName,
      skill
    } = request;
    const userExCreated = {
      userExperienceId: generateId(),
      userId,
      title,
      employmentType,
      companyName,
      location,
      locationType,
      currentlyWorking,
      startDate,
      endDate,
      industry,
      description,
      media,
      projectName,
      skill
    };
    const saveUserEx = this.userExperienceRep.create(userExCreated);
    await this.userExperienceRep.save(saveUserEx);

    return saveUserEx;
  }

  async findUserExperienceByUserId(userId: string) {
    const userEx = await this.userExperienceRep.find({
      where: {
        userId
      }
    });
    return userEx;
  }

  async findUserExperienceByUserExId(userExId: string) {
    const userEx = await this.userExperienceRep.findOne({
      where: {
        userExperienceId: userExId
      }
    });
    if (!userEx) {
      throw new NotFoundException(`User Experience with ID ${userEx} not found.`);
    }
    return userEx;
  }

  async updateUserExperience(userId: string, userExId: string, request: UpdateUserExperienceDto) {
    const {
      title,
      employmentType,
      companyName,
      location,
      locationType,
      currentlyWorking,
      startDate,
      endDate,
      industry,
      description,
      media,
      projectName,
      skill
    } = request;
    let userEx = await this.findUserExperienceByUserExId(userExId);
    if (userId !== userEx.userId) throw new BadRequestException('Permission Error!');
    if (title) userEx.title = title;
    if (employmentType) userEx.employmentType = employmentType;
    if (companyName) userEx.companyName = companyName;
    if (location) userEx.location = location;
    if (locationType) userEx.locationType = locationType;
    if (currentlyWorking) userEx.currentlyWorking = currentlyWorking;
    if (startDate) userEx.startDate = startDate;
    if (endDate) userEx.endDate = endDate;
    if (industry) userEx.industry = industry;
    if (description) userEx.description = description;
    if (media) userEx.media = media;
    if (projectName) userEx.projectName = projectName;
    if (skill) userEx.skill = skill;
    await this.userExperienceRep.save(userEx);
    return userEx;
  }
}
