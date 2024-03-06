import { BadRequestException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserByAdminDto, CreateUserDto } from './dto/request/create-user.dto';
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

    async updateUserByAdmin(userId: string, request: UpdateUserByAdminDto): Promise<UserResponseDto> {
        const { role } = request;
        let users = await this.findByUserId(userId);
        if (role) users.role = role;
        await this.userRep.save(users);
        return users;
    }

    // async updateUser(userId: string, request: )
}