import { GoogleOAuthClient } from "@/lib/lib-google-auth";
import { ApiResponseHelper } from "@/lib/lib-responses";
import { NextResponse } from "next/server";

export async function GET() {
  return await ApiResponseHelper(async () => {
    const url = GoogleOAuthClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "profile", "email"],
    });
    return NextResponse.redirect(url);
  });
}
