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
    IsStrongPassword,
    IsIn
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
    email?: string;

    @ApiProperty({
        example: 'David123@',
        description: 'The user\'s password (hashed)',
        required: true
    })
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

}

export class CreateUserByAdminDto extends CreateUserDto {
    @ApiProperty({
        example: 'user',
        required: false
    })
    @IsOptional()
    @IsIn(['user', 'admin'], { message: 'Role must be either "user" or "admin"' })
    role?: string;
}

export class CreateUserWithWalletDto extends CreateUserDto {
    @ApiProperty({
        example: 'awesomeuser123',
        description: 'The unique username of the user',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    address: string;
}

export class CreateUserWithTwitterDto extends CreateUserDto {
    @ApiProperty({
        example: 'awesomeuser123',
        description: 'The unique username of the user',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        example: 'awesomeuser123',
        description: 'The unique username of the user',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    displayName: string;

    @ApiProperty({
        example: 'awesomeuser123',
        description: 'The unique username of the user',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    image: string;
}