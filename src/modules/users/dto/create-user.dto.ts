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
export class CreateUserDto {
    @ApiProperty({
        example: 'awesomeuser123',
        description: 'The unique username of the user',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        example: 'david.thompson@email.com',
        description: 'The user\'s email address (optional, must be unique)',
        required: false
    })

    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty({
        example: 'David123@',
        description: 'The user\'s password (hashed)',
        required: true
    })
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

}