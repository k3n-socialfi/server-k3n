import { Body, Controller, Get, HttpCode, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SwaggerUserListResponseDto, SwaggerUserResponseDto, UserListResponseDto, UserResponseDto } from './dto/user-response.dto';
import { ResponseDto } from '@common/interceptors/success-response.dto';
import { FailureResponseDto } from '@common/exceptions/failure-response.dto';
import { AccessTokenGuard } from 'src/modules/auth/guards/accessToken.guard';
import { Request } from 'express';
import { Role } from '@common/constants/enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HasRoles } from '@common/decorators/has-roles.decorator';
import { PaginationParams } from '@common/dtos/pagination.dto';
import { RequestUserQuery } from './dto/request/query-user.dto';


@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('get-all-users')
    @ApiResponse({
        description: 'Respond Example',
        type: SwaggerUserResponseDto
    })
    // @ApiResponse({
    //     status: 201,
    //     description: 'Get user by user id',
    //     type: UserListResponseDto,
    //     example: {
    //         code: 200,
    //         message: 'Get user by user id successfully',
    //         data: {
    //             createdAt: 1700299087279,
    //             email: 'd@d.com',
    //             firstName: 'Jim',
    //             id: 'EIWFI7wzXD5-PPFlPVVS',
    //             image: 'fedora:8000/user/avatar/EIWFI7wzXD5-PPFlPVVS',
    //             introductionBrief: 'I am Jimmy Johnson',
    //             lastName: 'Johnson',
    //             level: 'Beginner',
    //             username: 'jim',
    //             paginationId: 4,
    //             role: 'Subscriber',
    //             totalCredit: 20,
    //             official: false,
    //             updatedAt: 1700299087279
    //         },
    //         error: ''
    //     },
    // })
    // @HasRoles(Role.Admin)
    // @UseGuards(AccessTokenGuard, RolesGuard)
    public async getAllUsers(@Query(new ValidationPipe({ transform: true })) query: RequestUserQuery,
    ) {
        // console.log('req:', req.user)
        let { page, limit } = query;
        page = page ? +page : 0;
        limit = limit ? +limit : 10;
        return {
            code: 201,
            message: "Get all user successful",
            data: await this.userService.findAllUsers({
                page,
                limit,
                ...query
            })
        };

    }

    // @Post('create-user')
    // @ApiOkResponse({
    //     description: 'Respond',
    //     type: ResponseDto<UserResponseDto>
    // })
    // @ApiNotFoundResponse({
    //     description: 'Respond 404 not found',
    //     type: FailureResponseDto
    // })
    // @ApiBadRequestResponse({
    //     description: 'Respond 400 bad request',
    //     type: FailureResponseDto
    // })
    // public async createWallet(
    //     @Body() request: CreateUserDto,
    // ): Promise<UserResponseDto> {
    //     return await this.userService.createUser(request);
    // }
}