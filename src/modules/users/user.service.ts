import { BadRequestException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository } from 'typeorm';
import { BlockchainWallet, SocialNetwork, User } from './entities/user.entity';
import { CreateUserByAdminDto, CreateUserDto, CreateUserWithTwitterDto, CreateUserWithWalletDto } from './dto/request/create-user.dto';
import { ErrorsCodes, ErrorsMap } from '@common/constants/respond-errors';
import { InternalUserResponseDto, LoginUserResponseDto, UserListResponseDto, UserResponseDto } from './dto/response/user-response.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthService } from '../auth/auth.service';
import { Role } from '@common/constants/enum';
import { RequestUserQuery } from './dto/request/query-user.dto';
import { UpdateUserByAdminDto } from './dto/request/admin-update-user.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(User) private userRep: Repository<User>,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
    ) { }
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

        const userResponse: UserResponseDto[] = users.map(user => {
            const { password, ...userData } = user;
            return userData;
        });

        return {
            users: userResponse,
            page: query.page,
            pageSize: users.length,
            totalPages: totalPages,
            totalItems: totalCount
        };
    }

    async findInternalByUsername(username: string): Promise<InternalUserResponseDto> {
        const user = await this.userRep.findOne({
            where: {
                username: username,
            }
        })
        return user;
    }

    async findByUserId(userId: string): Promise<UserResponseDto> {
        const user = await this.userRep.findOne({
            where: {
                userId: userId,
            }
        })
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found.`)
        }
        return user;
    }

    async findByUserAddress(address: string): Promise<UserResponseDto> {
        try {
            const users = await this.userRep.find({});
            const userWithAddress = users?.find(user =>
                user.wallets?.some(wallet => wallet.address === address)
            );
            return userWithAddress;
        } catch (err) {
            console.log('err:', err)
            throw err
        }

    }

    async findByTwitterUsername(username: string): Promise<UserResponseDto> {
        try {
            const users = await this.userRep.find({});
            const userWithUsername = users?.find(user =>
                user.socialProfiles?.some(social => social.username === username && social.social === 'twitter')
            );
            return userWithUsername;
        } catch (err) {
            console.log('err:', err)
            throw err
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
                email: email,
            },
        });
        if (!users || users.length == 0) {
            const userCreated = {
                username,
                role: role || Role.User,
                email: email,
                password,
            };
            const saveUser = this.userRep.create(userCreated);
            await this.userRep.save(saveUser);
            return saveUser;
        } else {
            console.log('User has been created wallet!');
            throw new BadRequestException(ErrorsMap[ErrorsCodes.ALREADY_EXISTS]);
        }
    }

    async createUserWithWallet(request: CreateUserWithWalletDto): Promise<UserResponseDto> {
        const { username, password, address } = request;
        const wallet = new BlockchainWallet;
        wallet.chainId = 1;
        wallet.address = address.toLowerCase();
        const userCreated = {
            username,
            password,
            role: Role.User,
            wallets: [wallet],
        };
        const saveUser = this.userRep.create(userCreated);
        await this.userRep.save(saveUser);
        return saveUser;
    }

    async createUserWithTwitter(request: CreateUserWithTwitterDto): Promise<UserResponseDto> {
        const { username, displayName, image, password } = request;
        const social = new SocialNetwork;
        social.social = 'twitter';
        social.username = username.toLowerCase();
        const userCreated = {
            username: username.toLowerCase(),
            avatar: image,
            fullName: displayName,
            password,
            role: Role.User,
            socialProfiles: [social],
        };
        const saveUser = this.userRep.create(userCreated);
        await this.userRep.save(saveUser);
        return saveUser;
    }

    async updateUserByAdmin(userId: string, request: UpdateUserByAdminDto): Promise<UserResponseDto> {
        const { role } = request;
        let users = await this.findByUserId(userId);
        if (role) users.role = role;
        await this.userRep.save(users);
        return users;
    }

    // async updateUser(userId: string, request: )
}