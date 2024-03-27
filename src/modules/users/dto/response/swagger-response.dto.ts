import { ResponseDto } from '@common/interceptors/success-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserListResponseDto, UserResponseDto } from './user-response.dto';
import { CreateUserByAdminDto } from '../request/create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class SwaggerUserResponseDto extends ResponseDto<UserResponseDto> {
  @ApiProperty({
    example: `{
            "createdAt": 1711555966,
            "updatedAt": 1711555966,
            "isDeleted": false,
            "userId": "6604457e87a19e4a7f03f12e",
            "username": "david",
            "role": "user",
            "type": null,
            "jobTitle": null,
            "organization": null,
            "experience": [],
            "fullName": null,
            "email": "david.thompson@email.com",
            "phoneNumber": null,
            "wallets": [],
            "socialProfiles": [],
            "twitterPoints": 0,
            "royaltyPoints": 0,
            "avatar": null,
            "bio": null,
            "coverImage": null,
            "dob": null,
            "gender": null,
            "location": null,
            "verificationStatus": null,
            "referralCode": null,
            "lastLogin": null
          }`,
    type: UserResponseDto
  })
  readonly data: UserResponseDto;
}

export class SwaggerUserListResponseDto extends ResponseDto<UserListResponseDto> {
  @ApiProperty({
    example: `{
        "users": [
          {
            "createdAt": 1711555966,
            "updatedAt": 1711555966,
            "isDeleted": false,
            "userId": "6604457e87a19e4a7f03f12e",
            "username": "david",
            "role": "user",
            "type": null,
            "jobTitle": null,
            "organization": null,
            "experience": [],
            "fullName": null,
            "email": "david.thompson@email.com",
            "phoneNumber": null,
            "wallets": [],
            "socialProfiles": [],
            "twitterPoints": 0,
            "royaltyPoints": 0,
            "avatar": null,
            "bio": null,
            "coverImage": null,
            "dob": null,
            "gender": null,
            "location": null,
            "verificationStatus": null,
            "referralCode": null,
            "lastLogin": null
          }
        ],
        "page": 0,
        "pageSize": 1,
        "totalPages": 1,
        "totalItems": 1
      }`,
    type: UserListResponseDto
  })
  readonly data: UserListResponseDto;
}

export class SwaggerCreateUserByAdminResponseDto extends ResponseDto<UserResponseDto> {
  @ApiProperty({
    example: '201',
    description: 'System code'
  })
  @IsNotEmpty()
  @IsString()
  readonly code: number;

  @ApiProperty({
    example: `Create user by admin successful`,
    description: 'Response message'
  })
  @IsNotEmpty()
  @IsString()
  readonly message: string;

  @ApiProperty({
    example: `{
              "username": "awesomeuser123b",
              "role": "user",
              "email": "david.thompson@email.com",
              "password": "David123@",
              "createdAt": 1709569827,
              "updatedAt": 1709569827,
              "isDeleted": false,
              "userId": "65e5f722c4363a928afc1168"
            }`,
    type: UserResponseDto
  })
  readonly data: UserResponseDto;
}

export class SwaggerUpdateUserByAdminResponseDto extends ResponseDto<UserResponseDto> {
  @ApiProperty({
    example: '200',
    description: 'System code'
  })
  @IsNotEmpty()
  @IsString()
  readonly code: number;

  @ApiProperty({
    example: `Update user by admin successful`,
    description: 'Response message'
  })
  @IsNotEmpty()
  @IsString()
  readonly message: string;

  @ApiProperty({
    example: `{
              "username": "awesomeuser123b",
              "role": "user",
              "email": "david.thompson@email.com",
              "password": "David123@",
              "createdAt": 1709569827,
              "updatedAt": 1709569827,
              "isDeleted": false,
              "userId": "65e5f722c4363a928afc1168"
            }`,
    type: UserResponseDto
  })
  readonly data: UserResponseDto;
}
