import * as crypto from 'crypto';
import * as nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';
import { BadGatewayException } from '@nestjs/common';
import type { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features';
import {
  createSignInMessageText,
  SolanaSignInInputWithRequiredFields,
  verifySignIn
} from '@solana/wallet-standard-util';

export function verifySIWS(message: string, output: SolanaSignInOutput): boolean {
  const nowMs = Date.now();
  const parse = JSON.parse(message);
  const expiredTime = new Date(parse.expirationTime);
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
    const expiredTime = new Date(parse.expirationTime);
    if (nowMs > expiredTime.getTime()) {
      return false;
    }

    const publicKey = new PublicKey(address);
    const domain = new URL(parse.domain);
    const hostName = domain.host;

    const input: SolanaSignInInputWithRequiredFields = {
      address: publicKey.toBase58(),
      domain: hostName,
      resources: [domain.origin],
      statement: parse.statement,
      version: parse.version,
      chainId: parse.chainId,
      nonce: parse.nonce,
      issuedAt: parse.issuedAt,
      expirationTime: parse.expirationTime
    };
    const signedMessage = createSignInMessageText(input);
    const signatureArray = stringToUint8Array(signature);
    const verified = nacl.sign.detached.verify(
      new TextEncoder().encode(signedMessage),
      signatureArray,
      publicKey.toBytes()
    );
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
    domain: 'https://client-k3n.vercel.app',
    address, // address of signer
    statement:
      'Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.',
    // uri: 'http://localhost:3000',
    version: '1',
    chainId: 'mainnet',
    nonce,
    issuedAt: new Date(nowMs).toISOString(),
    expirationTime: new Date(expireTime).toISOString(),
    resources: ['https://client-k3n.vercel.app']
  };
  return JSON.stringify(message);
}

export async function validateSolanaAddress(address: string) {
  console.log('address:', address);
  let publicKey: PublicKey;
  try {
    publicKey = new PublicKey(address);
    console.log('publicKey:', publicKey);
    return PublicKey.isOnCurve(publicKey.toBytes());
  } catch (err) {
    console.log('err:', err);
    return false;
  }
}

function stringToUint8Array(string: string): Uint8Array {
  // Remove formatting characters
  const cleanedString = string.replace(/[\[\]\s]/g, '');

  // Split into individual numbers
  const numberStrings = cleanedString.split(',');

  // Convert strings to numbers and create the Uint8Array
  const uint8Array = new Uint8Array(numberStrings.map(Number));

  return uint8Array;
}
