import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsNumber, ValidateNested, IsObject } from 'class-validator';
import { Column, ObjectId } from 'typeorm';
import { BlockchainWallet, SocialNetwork, UserExperience } from '../../entities/user.entity';
import { ResponseDto } from '@common/interceptors/success-response.dto';

export abstract class UserResponseDto {
  @ApiProperty({})
  @IsString()
  _id?: any;

  @ApiProperty({
    example: '63ec8b0da0922523f9ab12ad', // Example of a MongoDB ObjectId
    description: 'The unique ID of the user'
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'awesomeuser123',
    description: 'The unique username of the user',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'user',
    description: 'The role of the user',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({
    example: 'Influencer',
    description: 'Type of user (Caller, influencer, researcher, threador)'
  })
  @IsString()
  type?: string;

  @ApiProperty({
    example: 'Researcher',
    description: 'Primary Job Title'
  })
  @IsString()
  jobTitle?: string;

  @ApiProperty({
    example: 'Azuki',
    description: 'Primary Organization'
  })
  @IsString()
  organization?: string;

  @ApiProperty({
    example: [{}],
    description: "A list of the user's experience (format may vary)"
  })
  experience?: UserExperience[];

  @ApiProperty({
    example: 1000,
    description: 'Price per post'
  })
  @IsString()
  pricePerPost?: number;

  @ApiProperty({
    example: 'David Thompson',
    description: 'The full name of the user (optional)'
  })
  @IsString()
  fullName?: string;

  @ApiProperty({
    example: 'david.thompson@email.com',
    description: "The user's email address (optional, must be unique)"
  })
  @IsString()
  email?: string;

  @ApiProperty({
    example: 1234567890,
    description: "The user's phone number (optional, must be unique)"
  })
  phoneNumber?: number;

  // @ApiProperty({
  //   example: 'someHashedPassword',
  //   description: "The user's password (hashed)"
  // })
  // @Exclude()
  // @IsString()
  // password: string;

  @ApiProperty({
    example: [
      {
        chainId: 123,
        solana: 'So11111111111111111111111111111111111111'
      }
    ],
    description: "A list of the user's blockchain wallets (format may vary)"
  })
  wallets?: BlockchainWallet[];

  @ApiProperty({
    example: [
      {
        social: 'twitter',
        username: 'twitterUser1'
      }
    ],
    description: "Links to the user's social media profiles"
  })
  socialProfiles?: SocialNetwork[];

  @ApiProperty({
    example: 100,
    description: 'Twitter Points of user'
  })
  twitterPoints: number;

  @ApiProperty({
    example: 200,
    description: 'Royalty Points of user'
  })
  royaltyPoints: number;

  @ApiProperty({
    example: 300,
    description: 'Total Points of user'
  })
  totalPoints: number;

  @ApiProperty({
    example: 'https://example.com/profile_picture.jpg',
    description: "URL to the user's avatar image"
  })
  avatar?: string;

  @ApiProperty({
    example: 'A short bio about the user',
    description: 'A brief description of the user'
  })
  bio?: string;

  @ApiProperty()
  coverImage?: string;

  @ApiProperty()
  dob?: string;

  @ApiProperty()
  gender?: string;

  @ApiProperty()
  location?: string;

  @ApiProperty()
  verificationStatus?: boolean;

  @ApiProperty()
  referralCode?: string;

  @ApiProperty()
  lastLogin?: string;
}

export class InternalUserResponseDto extends UserResponseDto {
  @ApiProperty({
    example: 'someHashedPassword',
    description: "The user's password (hashed)"
  })
  @IsString()
  password: string;
}

export class LoginUserResponseDto {
  @ApiProperty({
    example: '{}',
    description: `
         user
        `,
    type: UserResponseDto
  })
  @IsObject()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({
    example: 'access_token.twitter',
    description: `
        accessToken
        `
  })
  accessToken: string;

  @ApiProperty({
    example: 'refresh_token',
    description: `
        refreshToken
        `
  })
  refreshToken: string;
}

export class UserListResponseDto {
  @ApiProperty({
    example: `[
            {
              "userId": "65e36d87d655e4cb2eb1eef4",
              "createdAt": 1709403527,
              "updatedAt": 1709403527,
              "isDeleted": false,
              "username": "awesomeuser1234",
              "role": "user",
              "avatar": "avatar"
            }
          ]`,
    description: `
         user
        `,
    type: UserResponseDto
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserResponseDto)
  users: UserResponseDto[];

  @ApiProperty({
    example: 0,
    description: `
        page
        `
  })
  page: number;

  @ApiProperty({
    example: 1,
    description: `
        pageSize
        `
  })
  pageSize: number;

  @ApiProperty({
    example: 1,
    description: `
        totalPages
        `
  })
  totalPages: number;

  @ApiProperty({
    example: 1,
    description: `
        totalItems
        `
  })
  totalItems: number;
}
