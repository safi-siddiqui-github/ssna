import { GoogleOAuthClient } from "@/lib/lib-google-auth";
import { ApiResponseHelper } from "@/lib/lib-responses";
import { Routes } from "@/lib/lib-routes";
import { CreateSessionHelper } from "@/lib/lib-session";
import prisma from "@/prisma/database";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  return await ApiResponseHelper(async () => {
    const baseUrl = process?.env?.NEXT_PUBLIC_FRONTEND_URL;
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    if (error) {
      throw new ZodError([
        {
          code: "custom",
          path: ["error"],
          message: error ?? "Error Occurred",
        },
      ]);
    }
    if (!code) {
      throw new ZodError([
        {
          code: "custom",
          path: ["code"],
          message: "Code is required",
        },
      ]);
    }
    // Exchange code → tokens
    const token = await GoogleOAuthClient.getToken(code);
    // Verify & get user profile
    const ticket = await GoogleOAuthClient.verifyIdToken({
      idToken: token?.tokens?.id_token ?? "",
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // User data from Google
    const googleUser = {
      email: payload?.email,
      firstname: payload?.given_name,
      lastname: payload?.family_name,
      avatar: payload?.picture,
      googleId: payload?.sub,
      emailVerified: payload?.email_verified,
      name: payload?.name,
    };

    const {
      email,
      firstname,
      lastname,
      avatar,
      googleId,
      // linkedinId,
      // facebookId,
      // appleId,
      emailVerified,
    } = googleUser;

    const oauthUser = await prisma.user.upsert({
      where: {
        email,
      },
      create: {
        email,
        username: email?.split("@")[0],
        ...(firstname ? { firstname } : {}),
        ...(lastname ? { lastname } : {}),
        ...(avatar ? { avatar } : {}),
        ...(googleId ? { googleId } : {}),
        // ...(linkedinId ? { linkedinId } : {}),
        // ...(facebookId ? { facebookId } : {}),
        // ...(appleId ? { appleId } : {}),
        ...(emailVerified ? { emailVerified } : {}),
        agreedTerms: true,
      },
      update: {
        ...(firstname ? { firstname } : {}),
        ...(lastname ? { lastname } : {}),
        ...(avatar ? { avatar } : {}),
        ...(googleId ? { googleId } : {}),
        // ...(linkedinId ? { linkedinId } : {}),
        // ...(facebookId ? { facebookId } : {}),
        // ...(appleId ? { appleId } : {}),
        ...(emailVerified ? { emailVerified } : {}),
      },
    });
    if (!oauthUser) {
      throw new ZodError([
        {
          code: "custom",
          path: ["oauth"],
          message: "Oauth User Error",
        },
      ]);
    }
    const sessionRes = await CreateSessionHelper({
      user: oauthUser,
    });
    if (!sessionRes.success) {
      throw new ZodError(sessionRes?.error?.details ?? []);
    }
    return NextResponse.redirect(
      `${baseUrl}${Routes.web.guest.socialLogin}?email=${oauthUser?.email}`,
    );
  });
}
