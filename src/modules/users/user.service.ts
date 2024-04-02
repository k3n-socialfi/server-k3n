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
import { Repository } from 'typeorm';
import { BlockchainWallet, SocialNetwork, User } from './entities/user.entity';
import { CreateUserByAdminDto, CreateUserWithTwitterDto, CreateUserWithWalletDto } from './dto/request/create-user.dto';
import { ErrorsCodes, ErrorsMap } from '@common/constants/respond-errors';
import { InternalUserResponseDto, UserListResponseDto, UserResponseDto } from './dto/response/user-response.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Role } from '@common/constants/enum';
import { RequestKolsTrending, RequestUserQuery } from './dto/request/query-user.dto';
import { UpdateUserByAdminDto } from './dto/request/admin-update-user.dto';
import { TwitterService } from '../twitter/twitter.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { verifySignature } from 'src/utils/verify-signature/solana-signature';
import { generateId } from 'src/utils/helper';
import { ObjectId } from 'mongodb';
import { TwitterUsers } from './entities/twitter-user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => TwitterService))
    private readonly twitterService: TwitterService,
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(TwitterUsers) private twitterUsersRep: Repository<TwitterUsers>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) {}
  async findAllUsers(query: RequestUserQuery): Promise<UserListResponseDto> {
    const skip = (query.page - 1) * query.limit;

    // query conditions
    const whereConditions: any = {};
    if (query.username) {
      whereConditions.username = query.username;
    }

    if (query.role) {
      whereConditions.role = query.role;
    }
    const [users, totalCount] = await Promise.all([
      this.userRep.find({
        where: whereConditions,
        skip: skip > 0 ? skip : 0,
        take: query.limit,
        order: { createdAt: 'DESC' }
      }),
      this.countDocuments()
    ]);

    const totalPages = Math.ceil(totalCount / query.limit);

    const userResponse: UserResponseDto[] = await Promise.all(
      users.map(async (user) => {
        const twitterUser = await this.twitterUsersRep.findOne({ where: { userId: user.userId } });
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
        return userData;
      })
    );

    // let userResponse: UserResponseDto[] = [];
    // for (let i = 0; i < users.length; i++) {
    //   const twitterUser = await this.twitterService.findTwitterUsersById(users[i].userId);
    //   const { password, _id, ...userData } = users[i];
    //   userData.twitterInfo = {
    //     followers: twitterUser.follower_count,
    //     followingCount: twitterUser.following_count,
    //     favouritesCount: twitterUser.favourites_count,
    //     externalUrl: twitterUser.external_url,
    //     numberOfTweets: twitterUser.number_of_tweets,
    //     creationDate: twitterUser.creation_date
    //   };
    //   userResponse.push(userData);
    // }

    return {
      users: userResponse,
      page: query.page,
      pageSize: users.length,
      totalPages: totalPages,
      totalItems: totalCount
    };
  }

  async findAll() {
    const user = this.userRep.find();
    return user;
  }

  async findKolsTrending(query: RequestKolsTrending) {
    const skip = (query.page - 1) * query.limit;

    // query conditions
    const whereConditions: any = {};
    // if (query.username) {
    //   whereConditions.username = query.username;
    // }

    // if (query.role) {
    //   whereConditions.role = query.role;
    // }
    const [twitterUsers, totalCount] = await Promise.all([
      this.twitterUsersRep.find({
        where: whereConditions,
        skip: skip > 0 ? skip : 0,
        take: query.limit,
        order: { totalPoints: 'DESC' }
      }),
      this.countDocuments()
    ]);

    const totalPages = Math.ceil(totalCount / query.limit);

    const userResponse = await Promise.all(
      twitterUsers.map(async (user) => {
        const { _id, ...userData } = user;
        return userData;
      })
    );

    return {
      users: userResponse,
      page: query.page,
      pageSize: twitterUsers.length,
      totalPages: totalPages,
      totalItems: totalCount
    };
  }

  async findTopKolsRanking(query: RequestKolsTrending): Promise<UserListResponseDto> {
    const skip = (query.page - 1) * query.limit;

    // query conditions
    const whereConditions: any = {};
    const [twitterUsers, totalCount] = await Promise.all([
      this.twitterUsersRep.find({
        where: whereConditions,
        skip: skip > 0 ? skip : 0,
        take: query.limit,
        order: { totalPoints: 'DESC' }
      }),
      this.countDocuments()
    ]);

    const totalPages = Math.ceil(totalCount / query.limit);

    const userResponse = await Promise.all(
      twitterUsers.map(async (user) => {
        const userInfo = await this.findByUserId(user.userId);
        return userInfo;
      })
    );

    return {
      users: userResponse,
      page: query.page,
      pageSize: twitterUsers.length,
      totalPages: totalPages,
      totalItems: totalCount
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

  async findByUserId(userId: string): Promise<UserResponseDto> {
    const user = await this.userRep.findOne({
      where: {
        userId
      }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    const twitterUser = await this.twitterUsersRep.findOne({ where: { userId: user.userId } });
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
    return userData;
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
    const twitterUser = await this.twitterUsersRep.findOne({ where: { userId: user.userId } });
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

    let userTweet = [];
    const usernameTwitter = user.socialProfiles.find((social) => social.social === 'twitter');
    if (usernameTwitter) {
      userTweet = await this.twitterService.getUserTweets({ username: usernameTwitter.username });
    }
    return {
      ...userData,
      posts: userTweet
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
      socialProfiles: [social]
    };
    const saveUser = this.userRep.create(userCreated);

    const twitterUserCreated = {
      userId: id,
      username,
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
    await Promise.all([this.userRep.create(saveUser), this.twitterUsersRep.save(saveTwitterUser)]);

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
    return saveUser;
  }

  async updateUserByAdmin(userId: string, request: UpdateUserByAdminDto): Promise<UserResponseDto> {
    const { role } = request;
    let users = await this.findByUserId(userId);
    if (role) users.role = role;
    await this.userRep.save(users);
    return users;
  }

  async updateProfileByUser(userId: string, request: UpdateUserByAdminDto): Promise<UserResponseDto> {
    const { role } = request;
    let users = await this.findByUserId(userId);
    if (role) users.role = role;
    await this.userRep.save(users);
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
    const message = await this.cacheManager.get(`${address}`);
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
      throw new BadRequestException('Twitter already connect another account');
    } else {
      const wallet = new BlockchainWallet();
      wallet.chainId = 1;
      wallet.address = address.toLowerCase();
      if (user.socialProfiles) {
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
}
