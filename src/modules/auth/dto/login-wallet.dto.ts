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
export class LoginSolanaDto {
    @ApiProperty({
        example: 'Dz4q1YKTnbCebTK942Ca5aHE3TvED5M8yra9b9vmhgvU',
        description: 'address',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    address: string;

    // @ApiProperty({
    //     example: 'k3n.com wants you to sign in with your Solana account:\nDz4q1YKTnbCebTK942Ca5aHE3TvED5M8yra9b9vmhgvU\n\nSign in with Solana to the app.\n\nURI: https://k3n.com\nVersion: 1\nChain ID: 1\nNonce: DonhYp3WnB2EUVH54\nIssued At: 2024-03-05T13:30:40.525Z\nExpiration Time: 2024-03-12T13:30:40.524Z',
    //     description: 'message',
    //     required: true
    // })
    // @IsNotEmpty()
    // @IsString()
    // message: string;

    @ApiProperty({
        example: '[230, 105, 233, 83, 188, 121, 156, 209, 157, 245, 118, 115, 136, 16, 138, 232, 21, 6, 33, 159, 83, 128, 93, 166, 217, 118, 221, 246, 74, 114, 122, 83, 55, 118, 244, 237, 132, 198, 184, 83, 208, 69, 99, 171, 214, 137, 102, 226, 225, 40, 86, 242, 31, 96, 52, 74, 100, 128, 71, 34, 90, 80, 89, 5]',
        description: 'signature',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    signature: string;
}