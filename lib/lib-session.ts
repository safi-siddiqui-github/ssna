"use server";

import prisma from "@/prisma/database";
import { addDays, isAfter } from "date-fns";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import {
  EncryptionObjectType,
  JoseDecryptHelper,
  JoseEncryptHelper,
} from "./lib-jose";
import {
  ActionResponseHelper,
  ResponseBodyType,
  ResponseDataType,
} from "./lib-responses";

const sessionName = process.env.USER_SESSION ?? "user-session";
const expiresAt = addDays(new Date(), 7);

export const CreateSessionHelper = async (
  creds: ResponseDataType,
): Promise<ResponseBodyType> => {
  return await ActionResponseHelper(async () => {
    const { user } = creds ?? {};
    if (!user || !user?.id) {
      throw new ZodError([
        {
          code: "custom",
          message: "User and users id is required",
          path: ["email"],
        },
      ]);
    }
    const session = await prisma.session.create({
      data: {
        userId: user?.id,
        expiresAt,
      },
    });
    const encryptObj: EncryptionObjectType = {
      sessionId: session?.id,
      isVerified: user?.emailVerified,
      expiresAt,
    };
    const encrypted = await JoseEncryptHelper(encryptObj);
    (await cookies()).set(sessionName, encrypted ?? "false", {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });
    return {
      success: true,
      data: {
        session,
      },
    };
  });
};

export const GetCookieHelper = async (): Promise<string | undefined> => {
  return (await cookies()).get(sessionName)?.value;
};

export async function DeleteSessionHelper(): Promise<ResponseBodyType> {
  return await ActionResponseHelper(async () => {
    // const cookiesRes = await GetCookieHelper();
    // const payload: EncryptionObjectType = await JoseDecryptHelper(
    //   cookiesRes ?? "false",
    // );
    // console.log(payload);
    (await cookies()).delete(sessionName);
    return {
      success: true,
      message: "Session Cleared",
    };
  });
}

export const VerifySessionHelper = async (): Promise<ResponseBodyType> => {
  const session = (await cookies()).get(sessionName)?.value ?? "false";
  const payload: EncryptionObjectType = await JoseDecryptHelper(
    session ?? "false",
  );
  if (
    payload &&
    isAfter(payload?.expiresAt ?? "", new Date()) &&
    payload.sessionId
  ) {
    // const apiRes = await ApiResponseHelper(
    //   async () =>
    //     await AxiosClient.post("session/verify", {
    //       id: payload?.sessionId,
    //     }),
    // );
    // if (
    //   apiRes?.success &&
    //   apiRes?.data?.session &&
    //   apiRes?.data?.session?.user
    // ) {
    //   return {
    //     success: true,
    //     data: {
    //       session: apiRes?.data?.session,
    //     },
    //   };
    // }
  }
  return {
    success: false,
  };
};
