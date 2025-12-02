import {
  EmailEmailVerificationCheckEmailFN,
  EmailEmailVerificationCheckEmailType,
} from "@/components/emails/auth/email-verification/EmailEmailVerificationCheckEmailComponent";
import { bcryptHashHelper } from "@/lib/bcryptjs";
import { ResponseHelper } from "@/lib/response";
import prisma from "@/prisma/database";
import { addMinutes } from "date-fns";
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

export async function POST(request: Request) {
  return ResponseHelper(async () => {
    const body = await request.json();
    const formSchema = z
      .object({
        firstname: z.string().min(2).max(50),
        lastname: z.string().min(2).max(50),
        email: z.email(),
        countryCode: z.string().min(2).max(10),
        phone: z.string().min(3).max(50),
        password: z.string().min(8).max(50),
        confirmPassword: z.string().min(8).max(50),
        agreedTerms: z.boolean(),
      })
      .superRefine((val, ctx) => {
        if (val.password !== val.confirmPassword) {
          ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"],
          });
        }
        if (val.agreedTerms !== true) {
          ctx.addIssue({
            code: "custom",
            message: "Accept terms & conditions",
            path: ["agreedTerms"],
          });
        }
        if (
          val.countryCode &&
          val.phone &&
          !isValidPhoneNumber(val.phone, val.countryCode as CountryCode)
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid Phone Number",
            path: ["phone"],
          });
        }
      });
    formSchema.parse(body);
    type bodyType = z.infer<typeof formSchema>;
    const {
      firstname,
      lastname,
      email,
      countryCode,
      phone,
      password,
      agreedTerms,
    }: bodyType = body;
    const userExistiingEmail = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (userExistiingEmail) {
      throw new ZodError([
        {
          code: "custom",
          path: ["email"],
          message: "Email is already in use",
        },
      ]);
    }
    const userExistiingPhone = await prisma.user.findFirst({
      where: {
        phone,
        countryCode,
      },
    });
    if (userExistiingPhone) {
      throw new ZodError([
        {
          code: "custom",
          path: ["phone"],
          message: "Phone is already in use",
        },
      ]);
    }
    const hashed = await bcryptHashHelper(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        username: email?.split("@")[0],
        firstname,
        lastname,
        countryCode,
        phone,
        password: hashed,
        agreedTerms,
      },
    });
    newUser.password = null;
    const randomUUid = crypto.randomUUID();
    const expiresAt = addMinutes(new Date(), 5);
    const otp = await prisma.oTP.create({
      data: {
        userId: newUser?.id,
        token: randomUUid,
        expiresAt,
      },
    });
    await EmailEmailVerificationCheckEmailFN({
      toAddress: newUser?.email,
      props: {
        otp,
      } satisfies EmailEmailVerificationCheckEmailType,
    });
    return NextResponse.json({
      success: true,
      // message: "Register Success",
      data: {
        user: newUser,
      },
    });
  });
}
