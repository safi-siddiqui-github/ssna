import {
  EmailForgotPasswordUpdatePasswordFN,
  EmailForgotPasswordUpdatePasswordType,
} from "@/components/emails/auth/forgot-password/EmailForgotPasswordUpdatePasswordComponent";
import { bcryptHashHelper } from "@/lib/bcryptjs";
import { ResponseHelper } from "@/lib/response";
import prisma from "@/prisma/database";
import { isAfter } from "date-fns";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

export async function POST(request: Request) {
  return ResponseHelper(async () => {
    const body = await request.json();
    const formSchema = z
      .object({
        email: z.email(),
        token: z.string().min(10),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
      })
      .superRefine((val, ctx) => {
        if (val.password !== val.confirmPassword) {
          ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"],
          });
        }
      });
    formSchema.parse(body);
    type bodyType = z.infer<typeof formSchema>;
    const { email, token, password }: bodyType = body;
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
    const hashed = await bcryptHashHelper(password);
    const userUpdated = await prisma.user.update({
      where: {
        id: otpExist?.user?.id,
      },
      data: {
        password: hashed,
      },
    });
    if (!userUpdated) {
      throw new ZodError([
        {
          code: "custom",
          path: ["email"],
          message: "Invalid Email",
        },
      ]);
    }
    await prisma.oTP.delete({
      where: {
        id: otpExist.id,
      },
    });
    await EmailForgotPasswordUpdatePasswordFN({
      toAddress: userUpdated?.email,
      props: {} satisfies EmailForgotPasswordUpdatePasswordType,
    });
    // userUpdated.password = null;
    return NextResponse.json({
      success: true,
      data: {
        // user: userUpdated,
      },
    });
  });
}
