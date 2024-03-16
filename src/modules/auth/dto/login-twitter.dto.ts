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
export class LoginWithTwitterDto {
    @ApiProperty({
        example: 'Dz4q1YKTnbCebTK942Ca5aHE3TvED5M8yra9b9vmhgvU',
        description: 'username',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        example: '',
        description: 'displayName',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    displayName: string;

    @ApiProperty({
        example: '',
        description: 'image',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    image: string;
}