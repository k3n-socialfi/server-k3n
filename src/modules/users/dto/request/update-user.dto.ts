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
export class UpdateUserDto {
    @ApiProperty({
        example: 'user',
        required: false,
        uniqueItems: true
    })
    @IsOptional()
    username: string;

    @ApiProperty({
        example: 'user',
        required: false
    })
    @IsOptional()
    fullName: string;

    // @ApiProperty({
    //     example: 'user',
    //     required: false
    // })
    // @IsOptional()
    // email: string;

    // @ApiProperty({
    //     example: 'user',
    //     required: false
    // })
    // @IsOptional()
    // phoneNumber: number;

    @ApiProperty({
        example: 'user',
        required: false
    })
    @IsOptional()
    password: string;

    // @ApiProperty({
    //     example: 'user',
    //     required: false
    // })
    // @IsOptional()
    // wallets: BlockchainWallet;

    // @ApiProperty({
    //     example: 'user',
    //     required: false
    // })
    // @IsOptional()
    // socialProfiles: SocialNetwork;

    // @Column({ default: '' })
    // avatar: string;

    // @Column({ default: '' })
    // bio: string;

    // @Column({ default: '' })
    // coverImage: string;

    // @Column({ default: '' })
    // dob: string;

    // @Column({ default: '' })
    // gender: string;

    // @Column({ default: '' })
    // country: string;
}