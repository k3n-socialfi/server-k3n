import * as crypto from 'crypto';
import * as nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';
import { BadGatewayException } from '@nestjs/common';
import type { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features';
import { verifySignIn } from '@solana/wallet-standard-util';

export function verifySIWS(message: string, output: SolanaSignInOutput): boolean {
  const nowMs = Date.now();
  const parse = JSON.parse(message);
  const expiredTime = new Date(parse.issuedAt);
  nowMs > expiredTime.getTime();

  if (nowMs > expiredTime.getTime()) {
    return false;
  }
  const input: SolanaSignInInput = {
    ...parse
  };
  const serialisedOutput: SolanaSignInOutput = {
    account: {
      publicKey: new Uint8Array(output.account.publicKey),
      ...output.account
    },
    signature: new Uint8Array(output.signature),
    signedMessage: new Uint8Array(output.signedMessage)
  };
  return verifySignIn(input, serialisedOutput);
}

export function verifySignature(message: string, signature: string, address: string): boolean {
  try {
    const nowMs = Date.now();
    const parse = JSON.parse(message);
    console.log('parse:', parse);
    const expiredTime = new Date(parse.expirationTime);
    console.log('expiredTime:', expiredTime.getTime());
    console.log('nowMs > expiredTime.getTime():', nowMs - expiredTime.getTime());
    if (nowMs > expiredTime.getTime()) {
      return false;
    }

    const publicKey = new PublicKey(address).toBytes();
    const signatureArray = stringToUint8Array(signature);
    const verified = nacl.sign.detached.verify(new TextEncoder().encode(parse), signatureArray, publicKey);
    return verified;
  } catch (err) {
    throw new BadGatewayException('Verify failed');
  }
}
export async function getMessageSolana(address) {
  const nonce = crypto.randomBytes(10).toString('hex');
  const nowMs = Date.now();
  const expireTime = nowMs + 15 * 60 * 1000;

  const message = {
    domain: 'https://www.k3n.com',
    address, // address of signer
    statement:
      'Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.',
    uri: 'https://www.k3n.com',
    version: '1',
    chainId: 'mainnet',
    nonce,
    issuedAt: new Date(nowMs).toISOString(),
    expirationTime: new Date(expireTime).toISOString()
    // resources: ["https://example.com", "https://phantom.app/"],
  };
  return JSON.stringify(message);
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
