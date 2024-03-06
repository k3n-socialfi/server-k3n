import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserByAdminDto, CreateUserDto } from './dto/request/create-user.dto';
import { UserListResponseDto, UserResponseDto } from './dto/response/user-response.dto';
import { ResponseDto } from '@common/interceptors/success-response.dto';
import { FailureResponseDto } from '@common/exceptions/failure-response.dto';
import { AccessTokenGuard } from 'src/modules/auth/guards/accessToken.guard';
import { Request } from 'express';
import { Role } from '@common/constants/enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HasRoles } from '@common/decorators/has-roles.decorator';
import { PaginationParams } from '@common/dtos/pagination.dto';
import { RequestUserQuery } from './dto/request/query-user.dto';
import { SwaggerCreateUserByAdminResponseDto, SwaggerUserListResponseDto, SwaggerUserResponseDto } from './dto/response/swagger-response.dto';


@Controller('users')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('')
    @ApiOkResponse({
        description: 'Get all user response',
        type: SwaggerUserListResponseDto
    })
    // @HasRoles(Role.Admin)
    // @UseGuards(AccessTokenGuard, RolesGuard)
    public async getAllUsers(@Query(new ValidationPipe({ transform: true })) query: RequestUserQuery,
    ) {
        // console.log('req:', req.user)
        let { page, limit } = query;
        page = page ? +page : 0;
        limit = limit ? +limit : 10;
        return {
            code: 200,
            message: "Get all user successful",
            data: await this.userService.findAllUsers({
                page,
                limit,
                ...query
            })
        };

    }

    @Get(':id')
    @ApiResponse({
        description: 'Get user by id response',
        type: SwaggerUserResponseDto
    })
    public async getUserById(@Param('userId') userId: string) {
        return {
            code: 200,
            message: "Get user by id successful",
            data: await this.userService.findByUserId(userId)
        }
    }

    @Post('create')
    @ApiCreatedResponse({
        description: 'Create user by admin response',
        type: SwaggerCreateUserByAdminResponseDto
    })
    // @UseGuards(AccessTokenGuard, RolesGuard)
    public async createUser(
        @Body() request: CreateUserByAdminDto,
    ) {
        return {
            code: 201,
            message: "Create user by id successful",
            data: await this.userService.createUser(request)
        }
    }
}