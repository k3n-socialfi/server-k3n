import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    ValidateNested,
    IsNumber,
    IsArray,
    ArrayMinSize,
    IsOptional,
    IsBoolean,
    IsEmail,
    IsStrongPassword
} from 'class-validator';
export class LoginUserDto {
    @ApiProperty({
        example: 'user1',
        description: `
          username
        `,
        required: true
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        example: 'password123@',
        description: `
         password
        `,
        required: true
    })
    @IsNotEmpty()
    password: string;
}