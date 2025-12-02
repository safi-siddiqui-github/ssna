import {
  EmailForgotPasswordCheckEmailFN,
  EmailForgotPasswordCheckEmailType,
} from "@/components/emails/auth/forgot-password/EmailForgotPasswordCheckEmailComponent";
import { ResponseHelper } from "@/lib/response";
import prisma from "@/prisma/database";
import crypto from "crypto";
import { addMinutes } from "date-fns";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

export async function POST(request: Request) {
  return ResponseHelper(async () => {
    const body = await request.json();
    const formSchema = z.object({
      email: z.email(),
    });
    formSchema.parse(body);
    type bodyType = z.infer<typeof formSchema>;
    const { email }: bodyType = body;
    const userExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!userExist) {
      throw new ZodError([
        {
          code: "custom",
          path: ["email"],
          message: "Invalid email",
        },
      ]);
    }
    const randomUUid = crypto.randomUUID();
    const expiresAt = addMinutes(new Date(), 5);
    const otp = await prisma.oTP.create({
      data: {
        userId: userExist?.id,
        token: randomUUid,
        expiresAt,
      },
    });
    await EmailForgotPasswordCheckEmailFN({
      toAddress: userExist?.email,
      props: {
        otp,
      } satisfies EmailForgotPasswordCheckEmailType,
    });
    // userExist.password = null;
    return NextResponse.json({
      success: true,
      data: {
        // user: userExist,
        // otp,
      },
    });
  });
}
