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
export class UpdateUserByAdminDto {
    @ApiProperty({
        example: 'user',
        required: false
    })
    @IsOptional()
    @IsIn(['user', 'admin'], { message: 'Role must be either "user" or "admin"' })
    role?: string;
}