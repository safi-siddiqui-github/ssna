"use server";

import { SignupSchema } from "@/app/(web)/(guest)/signup/_components/lib";
import { bcryptHashHelper } from "@/lib/lib-bcryptjs";
import { UserDTO } from "@/lib/lib-dto";
import { ActionResponseHelper, ResponseDataType } from "@/lib/lib-responses";
import prisma from "@/prisma/database";
import { ZodError } from "zod";
import { SignupEmailFN } from "./email";

export const SignupAction = async (req?: ResponseDataType) =>
  ActionResponseHelper(async () => {
    const { user } = req ?? {};
    const { email, password } = user ?? {};
    SignupSchema.parse({ email, password });
    const userExist = await prisma?.user?.findFirst({
      where: {
        email,
      },
    });
    if (userExist) {
      throw new ZodError([
        {
          code: "custom",
          message: "User already exists",
          path: ["email"],
        },
      ]);
    }
    const hashed = await bcryptHashHelper(password);
    const userNew = await prisma?.user?.create({
      data: {
        email,
        password: hashed,
      },
    });
    if (!userNew) {
      throw new ZodError([
        {
          code: "custom",
          message: "User not created",
          path: ["email"],
        },
      ]);
    }
    const emailRes = await SignupEmailFN({ user: userNew });
    if (!emailRes?.success) {
      throw new ZodError([
        {
          code: "custom",
          message: "Email not sent",
          path: ["email"],
        },
      ]);
    }
    return {
      success: true,
      data: {
        user: UserDTO(userNew),
      },
    };
  });
