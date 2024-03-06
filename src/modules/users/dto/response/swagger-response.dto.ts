import { ResponseDto } from "@common/interceptors/success-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { UserListResponseDto, UserResponseDto } from "./user-response.dto";
import { CreateUserByAdminDto } from "../request/create-user.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class SwaggerUserResponseDto extends ResponseDto<UserResponseDto> {
    @ApiProperty({
        example: `{
            "userId": "65e36d87d655e4cb2eb1eef4",
            "createdAt": 1709403527,
            "updatedAt": 1709403527,
            "isDeleted": false,
            "username": "awesomeuser1234",
            "role": "user",
            "avatar": "avatar"
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
                "userId": "65e36d87d655e4cb2eb1eef4",
                "createdAt": 1709403527,
                "updatedAt": 1709403527,
                "isDeleted": false,
                "username": "awesomeuser1234",
                "role": "user",
                "avatar": "avatar"
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