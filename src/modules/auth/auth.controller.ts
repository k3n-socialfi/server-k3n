import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/modules/auth/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/modules/auth/guards/refreshToken.guard';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '@common/interceptors/success-response.dto';
import { LoginUserResponseDto, UserResponseDto } from '../users/dto/user-response.dto';
import { FailureResponseDto } from '@common/exceptions/failure-response.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';


@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return {
      code: 201,
      message: "Sigup successful",
      data: await this.authService.signUp(createUserDto)
    };
  }

  @Post('signin')
  @ApiResponse({
    description: 'Respond',
    type: ResponseDto<UserResponseDto>
  })
  async signIn(
    @Body() request: LoginUserDto,
  ) {
    return {
      code: 201,
      message: "Sigin successful",
      data: await this.authService.signIn(request)
    };
  }

  // @UseGuards(RefreshTokenGuard)
  // @Get('refresh')
  // refreshTokens(@Req() req: Request) {
  //   const refreshToken = req.headers['refreshToken'].toString();
  //   return this.authService.refreshTokens(refreshToken);
  // }
  @Get('refresh')
  async refreshTokens(@Query('refresh_token') refresh_token: string) {
    // console.log('refresh_token:', refresh_token)
    // const refreshToken = req.headers['refreshToken'].toString();
    return {
      code: 201,
      message: "Get refreshTokens successful",
      data: await this.authService.refreshTokens(refresh_token)
    };
  }
}
