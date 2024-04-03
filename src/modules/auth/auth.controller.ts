import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/modules/auth/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/modules/auth/guards/refreshToken.guard';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '@common/interceptors/success-response.dto';
import { LoginUserResponseDto, UserResponseDto } from '../users/dto/response/user-response.dto';
import { FailureResponseDto } from '@common/exceptions/failure-response.dto';
import { LoginUserDto } from '../users/dto/request/login-user.dto';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { LoginSolanaDto } from './dto/login-wallet.dto';
import { SwaggerUserResponseDto } from '../users/dto/response/swagger-response.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('signup')
  // @ApiResponse({
  //   description: 'Sigup successful',
  //   type: SwaggerUserResponseDto
  // })
  // async signup(@Body() createUserDto: CreateUserDto) {
  //   return {
  //     code: 201,
  //     message: 'Sigup successful',
  //     data: await this.authService.signUp(createUserDto)
  //   };
  // }

  // @Post('signin')
  // @ApiResponse({
  //   description: 'Signin successful',
  //   type: SwaggerUserResponseDto
  // })
  // @ApiResponse({
  //   description: 'Respond',
  //   type: ResponseDto<UserResponseDto>
  // })
  // async signIn(@Body() request: LoginUserDto) {
  //   return {
  //     code: 200,
  //     message: 'Sigin successful',
  //     data: await this.authService.signIn(request)
  //   };
  // }

  // @UseGuards(RefreshTokenGuard)
  // @Get('refresh')
  // refreshTokens(@Req() req: Request) {
  //   const refreshToken = req.headers['refreshToken'].toString();
  //   return this.authService.refreshTokens(refreshToken);
  // }
  @Get('refresh/:refresh_token')
  async refreshTokens(@Param('refresh_token') refresh_token: string) {
    // console.log('refresh_token:', refresh_token)
    // const refreshToken = req.headers['refreshToken'].toString();
    return {
      code: 200,
      message: 'Get refreshTokens successful',
      data: await this.authService.refreshTokens(refresh_token)
    };
  }

  @Get('message-solana/:address')
  async getMessageSolana(@Param('address') address: string) {
    console.log('address:', address);
    return {
      code: 200,
      message: 'Get sign message successful',
      data: await this.authService.getMessageSolana(address.toLowerCase())
    };
  }

  @Post('login-solana')
  @ApiResponse({
    description: 'Respond',
    type: ResponseDto<UserResponseDto>
  })
  async loginWallet(@Body() request: LoginSolanaDto) {
    return {
      code: 200,
      message: 'Verify successful',
      data: await this.authService.loginSolana(request)
    };
  }
}
