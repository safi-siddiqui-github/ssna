import { ResponseHelper } from "@/lib/response";
import prisma from "@/prisma/database";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  return ResponseHelper(async () => {
    const body = await request.json();
    const formSchema = z.object({
      email: z.email(),
      firstname: z.string().min(1).nullish(),
      lastname: z.string().min(1).nullish(),
      avatar: z.string().min(1).nullish(),
      googleId: z.string().min(1).nullish(),
      facebookId: z.string().min(1).nullish(),
      linkedinId: z.string().min(1).nullish(),
      appleId: z.string().min(1).nullish(),
      emailVerified: z.boolean().nullish(),
    });
    formSchema.parse(body);
    type bodyType = z.infer<typeof formSchema>;
    const {
      firstname,
      lastname,
      email,
      avatar,
      googleId,
      linkedinId,
      facebookId,
      appleId,
      emailVerified,
    }: bodyType = body;
    const oathUser = await prisma.user.upsert({
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
        ...(linkedinId ? { linkedinId } : {}),
        ...(facebookId ? { facebookId } : {}),
        ...(appleId ? { appleId } : {}),
        ...(emailVerified ? { emailVerified } : {}),
        agreedTerms: true,
      },
      update: {
        ...(firstname ? { firstname } : {}),
        ...(lastname ? { lastname } : {}),
        ...(avatar ? { avatar } : {}),
        ...(googleId ? { googleId } : {}),
        ...(linkedinId ? { linkedinId } : {}),
        ...(facebookId ? { facebookId } : {}),
        ...(appleId ? { appleId } : {}),
        ...(emailVerified ? { emailVerified } : {}),
      },
    });
    return NextResponse.json({
      success: true,
      data: {
        user: oathUser,
      },
    });
  });
}
