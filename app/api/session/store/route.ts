import { ResponseHelper } from "@/lib/response";
import prisma from "@/prisma/database";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  return ResponseHelper(async () => {
    const body = await request.json();
    const formSchema = z.object({
      userId: z.number().min(1),
      expiresAt: z.iso.datetime(),
    });
    formSchema.parse(body);
    type bodyType = z.infer<typeof formSchema>;
    const { userId, expiresAt }: bodyType = body;
    const exp = new Date(expiresAt);
    // const session = {
    //   userId,
    //   expiresAt: exp,
    // };

    const session = await prisma.session.create({
      data: {
        userId,
        expiresAt: exp,
      },
      include: {
        user: true,
      },
    });
    return NextResponse.json({
      success: true,
      data: {
        session,
      },
    });
  });
}
