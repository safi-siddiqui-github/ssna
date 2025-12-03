"use server";

import { OrNull } from "@/types/types-models";
import { jwtVerify, SignJWT } from "jose";

export type EncryptionObjectType = {
  sessionId?: OrNull<number>;
  expiresAt?: OrNull<Date>;
  isVerified?: OrNull<boolean>;
};

const algorithm = "HS256";
const sessionKey = process.env.SESSION_KEY;
const expiredObject: EncryptionObjectType = {
  sessionId: null,
  expiresAt: null,
  isVerified: null,
};

const getEncodedKey = async () => {
  return new TextEncoder().encode(sessionKey || "fallback-secret");
};

// JWTPayload
export const JoseEncryptHelper = async (
  payload: EncryptionObjectType,
): Promise<string> => {
  //
  const encodedKey = await getEncodedKey();
  //
  return new SignJWT(payload)
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
  //
};

export const JoseDecryptHelper = async (
  session?: string,
): Promise<EncryptionObjectType> => {
  try {
    if (!session) {
      return expiredObject;
    }
    const encodedKey = await getEncodedKey();
    const { payload } = await jwtVerify<EncryptionObjectType>(
      session,
      encodedKey,
      {
        algorithms: [algorithm],
      },
    );
    return payload;
  } catch (error: unknown) {
    return expiredObject;
    throw error;
  }
};
