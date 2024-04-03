import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
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
import { RequestKolsTrending, RequestUserQuery } from './dto/request/query-user.dto';
import {
  SwaggerCreateUserByAdminResponseDto,
  SwaggerUpdateUserByAdminResponseDto,
  SwaggerUserListResponseDto,
  SwaggerUserResponseDto
} from './dto/response/swagger-response.dto';
import { UpdateUserByAdminDto } from './dto/request/admin-update-user.dto';
import { ConnectTwitterDto } from './dto/request/connect-twitter.dto';
import { LoginSolanaDto } from '../auth/dto/login-wallet.dto';
import { CreateUserExperienceDto, UpdateUserExperienceDto } from './dto/request/experience.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @ApiOkResponse({
    description: 'Get all user response',
    type: SwaggerUserListResponseDto
  })
  // @HasRoles(Role.Admin)
  // @UseGuards(AccessTokenGuard, RolesGuard)
  public async getAllUsers(@Query(new ValidationPipe({ transform: true })) query: RequestUserQuery) {
    // console.log('req:', req.user)
    let { page, limit } = query;
    page = page ? +page : 0;
    limit = limit ? +limit : 10;
    return {
      code: 200,
      message: 'Get all user successful',
      data: await this.userService.findAllUsers({
        page,
        limit,
        ...query
      })
    };
  }

  @Get('kols/trending')
  // @ApiOkResponse({
  //   description: 'Get all user response',
  //   type: SwaggerUserListResponseDto
  // })
  // @HasRoles(Role.Admin)
  // @UseGuards(AccessTokenGuard, RolesGuard)
  public async getKolsTrending(@Query(new ValidationPipe({ transform: true })) query: RequestKolsTrending) {
    // console.log('req:', req.user)
    let { page, limit, type } = query;
    page = page ? +page : 0;
    limit = limit ? +limit : 10;
    return {
      code: 200,
      message: 'Get all user successful',
      data: await this.userService.findKolsTrending({
        page,
        limit,
        type
      })
    };
  }

  @Get('kols/ranking')
  // @ApiOkResponse({
  //   description: 'Get all user response',
  //   type: SwaggerUserListResponseDto
  // })
  // @HasRoles(Role.Admin)
  // @UseGuards(AccessTokenGuard, RolesGuard)
  public async findTopKolsRanking(@Query(new ValidationPipe({ transform: true })) query: RequestKolsTrending) {
    let { page, limit, type } = query;
    page = page ? +page : 0;
    limit = limit ? +limit : 100;
    return {
      code: 200,
      message: 'Get all user successful',
      data: await this.userService.findTopKolsRanking({
        page,
        limit,
        type
      })
    };
  }

  @Get(':userId')
  @ApiResponse({
    description: 'Get user by id response',
    type: SwaggerUserResponseDto
  })
  public async getUserById(@Param('userId') userId: string) {
    return {
      code: 200,
      message: 'Get user by id successful',
      data: await this.userService.findByUserId(userId)
    };
  }

  @Get('profile/:username')
  @ApiResponse({
    description: 'Get profile user by username response',
    type: SwaggerUserResponseDto
  })
  public async getProfileUserById(@Param('username') username: string) {
    return {
      code: 200,
      message: 'Get user by username successful',
      data: await this.userService.findProfileByUsername(username)
    };
  }

  @Get('my/profile')
  @ApiResponse({
    description: 'Get my profile response',
    type: SwaggerUserResponseDto
  })
  @UseGuards(AccessTokenGuard)
  public async getMyProfile(@Req() req: Request) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    return {
      code: 200,
      message: 'Get my profile successful',
      data: await this.userService.findProfileByUsername(userObject.username)
    };
  }

  // @Put('update')
  // @ApiResponse({
  //     description: 'Update user response',
  //     type: SwaggerUpdateUserByAdminResponseDto
  // })
  // // @UseGuards(AccessTokenGuard, RolesGuard)
  // public async updateUser(
  //     @Body() request: UpdateUserByAdminDto,
  //     @Req() req: Request,
  // ) {
  //     if (!request) throw new BadRequestException("Body request cannot be empty");
  //     return {
  //         code: 201,
  //         message: "Update user by id successful",
  //         data: await this.userService.updateUserByAdmin(req.user['sub'], request)
  //     }
  // }

  // For Admin
  @Post('create')
  @ApiCreatedResponse({
    description: 'Create user by admin response',
    type: SwaggerCreateUserByAdminResponseDto
  })
  @UseGuards(AccessTokenGuard, RolesGuard)
  public async createUser(@Body() request: CreateUserByAdminDto) {
    return {
      code: 201,
      message: 'Create user by id successful',
      data: await this.userService.createUser(request)
    };
  }

  @Put('profile/update')
  @ApiResponse({
    description: 'Update user by response',
    type: SwaggerUpdateUserByAdminResponseDto
  })
  @UseGuards(AccessTokenGuard)
  public async updateProfileByUser(@Req() req: Request, @Body() request: UpdateUserDto) {
    if (!request) throw new BadRequestException('Body request cannot be empty');
    const userObject = JSON.parse(JSON.stringify(req.user));
    return {
      code: 201,
      message: 'Update user by admin successful',
      data: await this.userService.updateProfileByUser(userObject.sub, request)
    };
  }

  @Put('admin-update/:userId')
  @ApiResponse({
    description: 'Update user by admin response',
    type: SwaggerUpdateUserByAdminResponseDto
  })
  @UseGuards(AccessTokenGuard, RolesGuard)
  public async updateUserByAdmin(@Param('userId') userId: string, @Body() request: UpdateUserByAdminDto) {
    if (!request) throw new BadRequestException('Body request cannot be empty');
    return {
      code: 201,
      message: 'Update user by admin successful',
      data: await this.userService.updateUserByAdmin(userId, request)
    };
  }

  @Post('connect/twitter')
  @UseGuards(AccessTokenGuard)
  public async connectTwitter(@Req() req: Request, @Body() request: ConnectTwitterDto) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    return {
      code: 201,
      message: 'Update user by admin successful',
      data: await this.userService.connectTwitter(userObject?.username, request.tweetId)
    };
  }

  @Post('connect/wallet/solana')
  @UseGuards(AccessTokenGuard)
  public async connectWalletSolana(@Req() req: Request, @Body() request: LoginSolanaDto) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    return {
      code: 201,
      message: 'Update user by admin successful',
      data: await this.userService.connectWalletSolana(userObject?.username, request.address, request.signature)
    };
  }

  // @Post('/points/update')
  // @UseGuards(AccessTokenGuard)
  // public async updatePoints(@Req() req: Request) {
  //   const userObject = JSON.parse(JSON.stringify(req.user));
  //   // console.log('userObject:', userObject);
  //   return {
  //     code: 201,
  //     message: 'Update points successful',
  //     data: await this.userService.updateUserPoints(userObject?.username)
  //   };
  // }

  @Post('experience/create')
  // @ApiCreatedResponse({
  //   description: 'Create user experience response',
  //   type: SwaggerCreateUserByAdminResponseDto
  // })
  @UseGuards(AccessTokenGuard)
  public async createUserExperience(@Req() req: Request, @Body() request: CreateUserExperienceDto) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    return {
      code: 201,
      message: 'Create user by id successful',
      data: await this.userService.createUserExperience(userObject?.sub, request)
    };
  }

  @Put('experience/:id/update')
  // @ApiCreatedResponse({
  //   description: 'Create user experience response',
  //   type: SwaggerCreateUserByAdminResponseDto
  // })
  @UseGuards(AccessTokenGuard)
  public async updateUserExperience(
    @Req() req: Request,
    @Param('userExperienceId') userExperienceId: string,
    @Body() request: UpdateUserExperienceDto
  ) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    return {
      code: 201,
      message: 'Update user experience by id successful',
      data: await this.userService.updateUserExperience(userObject?.sub, userExperienceId, request)
    };
  }
}
