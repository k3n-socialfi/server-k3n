import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { JwtType } from '@common/constants/enum';
import { LoginUserResponseDto } from '../users/dto/response/user-response.dto';
import { LoginUserDto } from '../users/dto/request/login-user.dto';
import { randomString } from 'src/utils/helper';
import { LoginSolanaDto } from './dto/login-wallet.dto';
import { getMessageSolana, verifySignature } from 'src/utils/verify-signature/solana-signature';
import { LoginWithTwitterDto } from './dto/login-twitter.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async getMessageSolana(address: string) {
    const msg = await getMessageSolana(address);
    await this.cacheManager.set(`${address.toLowerCase()}`, msg);

    return msg;
  }

  async loginSolana(req: LoginSolanaDto): Promise<LoginUserResponseDto> {
    const { address, signature } = req;
    const message = await this.cacheManager.get(`${address.toLowerCase()}`);
    if (!message) throw new NotFoundException('Sign message not found!. Please try again');
    const verified = verifySignature(message.toString(), signature, address);
    if (!verified) throw new ForbiddenException('Access Denied');
    const userExists = await this.usersService.findByUserAddress(address);
    if (userExists) {
      const tokens = await this.getTokens(userExists.userId, userExists.username, userExists.role);
      return {
        user: userExists,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };
    } else {
      // Hash password
      const password = randomString(10);
      const username = randomString(8);
      const hash = await this.hashData(password);
      const newUser = await this.usersService.createUserWithWallet({
        username,
        address,
        password: hash
      });
      const tokens = await this.getTokens(newUser.userId, newUser.username, newUser.role);
      return {
        user: newUser,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };
    }
  }

  async loginWithTwitter(req: LoginWithTwitterDto): Promise<LoginUserResponseDto> {
    const { username, displayName, image } = req;

    const userExists = await this.usersService.findByTwitterUsername(username);
    if (userExists) {
      const tokens = await this.getTokens(userExists.userId, userExists.username, userExists.role);
      return {
        user: userExists,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };
    } else {
      // Hash password
      const password = randomString(10);
      const hash = await this.hashData(password);
      const newUser = await this.usersService.createUserWithTwitter({
        username,
        password: hash,
        displayName,
        image
      });
      const tokens = await this.getTokens(newUser.userId, newUser.username, newUser.role);
      return {
        user: newUser,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };
    }
  }

  async signUp(req: CreateUserDto): Promise<LoginUserResponseDto> {
    // Check if user exists
    const userExists = await this.usersService.findInternalByUsername(req.username);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(req.password);
    const newUser = await this.usersService.createUser({
      ...req,
      password: hash
    });
    const tokens = await this.getTokens(newUser.userId, newUser.username, newUser.role);
    return {
      user: newUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  async signIn(data: LoginUserDto): Promise<LoginUserResponseDto> {
    // Check if user exists
    const user = await this.usersService.findInternalByUsername(data.username);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.userId, user.username, user.role);
    const { password, _id, ...userData } = user;
    return {
      user: userData,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  async refreshTokens(refreshToken: string) {
    const username = this.decodeJwt(refreshToken, JwtType.Refresh);
    const user = await this.usersService.findByUserName(username);
    const tokens = await this.getTokens(user.userId, user.username, user.role);
    return tokens;
  }

  async hashData(data: string) {
    const hash = await bcrypt.hash(data, 10);
    return hash;
  }

  async getTokens(userId: string, username: string, role: string) {
    const configJWT = this.configService.get('jwt');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role
        },
        {
          secret: configJWT.access_secret,
          expiresIn: configJWT.accessExpiresIn
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role
        },
        {
          secret: configJWT.refresh_secret,
          expiresIn: configJWT.refreshExpiresIn
        }
      )
    ]);

    return {
      accessToken,
      refreshToken
    };
  }
  decodeJwt(jwt: string, tokenType: JwtType) {
    const configJWT = this.configService.get('jwt');
    let jwtSecret: string;

    if (tokenType === JwtType.Access) {
      jwtSecret = configJWT.access_secret;
    } else if (tokenType === JwtType.Refresh) {
      jwtSecret = configJWT.refresh_secret;
    } else {
      throw new ForbiddenException('Access Denied');
    }

    try {
      const decodedToken = this.jwtService.decode(jwt);
      if (decodedToken && decodedToken.hasOwnProperty('username')) {
        return decodedToken.username;
      } else {
        throw new ForbiddenException('Failed to decode or validate token.');
      }
    } catch (error) {
      throw new ForbiddenException('Failed to decode or validate token');
    }
  }
}
