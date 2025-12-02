import { ResponseHelper } from "@/lib/response";
import prisma from "@/prisma/database";
import { isAfter } from "date-fns";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

export async function POST(request: Request) {
  return ResponseHelper(async () => {
    const body = await request.json();
    const formSchema = z.object({
      email: z.email(),
      token: z.string().min(10),
    });
    formSchema.parse(body);
    type bodyType = z.infer<typeof formSchema>;
    const { email, token }: bodyType = body;
    const otpExist = await prisma.oTP.findFirst({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
    if (!otpExist) {
      throw new ZodError([
        {
          code: "custom",
          path: ["token"],
          message: "Invalid token",
        },
      ]);
    }
    if (email !== otpExist?.user?.email) {
      throw new ZodError([
        {
          code: "custom",
          path: ["email"],
          message: "Invalid email",
        },
      ]);
    }
    if (!isAfter(otpExist?.expiresAt ?? "", new Date())) {
      throw new ZodError([
        {
          code: "custom",
          path: ["token"],
          message: "Invalid token",
        },
      ]);
    }
    return NextResponse.json({
      success: true,
      data: {
        // otp: otpExist,
      },
    });
  });
}
