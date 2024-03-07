import * as nacl from 'tweetnacl'
import { PublicKey } from '@solana/web3.js';
import { BadGatewayException } from '@nestjs/common';

export function verifySignature(message: string, signature: string, address: string): boolean {

    try {
        const publicKey = new PublicKey(address).toBytes();
        const signatureArray = stringToUint8Array(signature);
        const verified = nacl
            .sign
            .detached
            .verify(
                new TextEncoder().encode(message),
                signatureArray,
                publicKey
            )
        return verified
    } catch (err) {
        throw new BadGatewayException('Verify faild');
    }

}
function stringToUint8Array(string): Uint8Array {
    // Remove formatting characters
    const cleanedString = string.replace(/[\[\]\s]/g, '');

    // Split into individual numbers
    const numberStrings = cleanedString.split(',');

    // Convert strings to numbers and create the Uint8Array
    const uint8Array = new Uint8Array(numberStrings.map(Number));

    return uint8Array;
}

