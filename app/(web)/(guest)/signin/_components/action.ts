"use server";

import { bcryptCompareHelper } from "@/lib/lib-bcryptjs";
import { UserDTO } from "@/lib/lib-dto";
import { ActionResponseHelper, ResponseDataType } from "@/lib/lib-responses";
import { CreateSessionHelper } from "@/lib/lib-session";
import prisma from "@/prisma/database";
import { ZodError } from "zod";
import { SigninSchema } from "./lib";

export const SigninAction = async (req?: ResponseDataType) =>
  ActionResponseHelper(async () => {
    const { user } = req ?? {};
    const { email, password } = user ?? {};
    SigninSchema.parse({ email, password, remember: true });
    const userExist = await prisma?.user?.findFirst({
      where: {
        email,
      },
    });
    if (!userExist) {
      throw new ZodError([
        {
          code: "custom",
          message: "User doesnot exists",
          path: ["email"],
        },
      ]);
    }
    const compare = await bcryptCompareHelper(password, userExist?.password);
    if (!compare) {
      throw new ZodError([
        {
          code: "custom",
          message: "User password incorrect",
          path: ["email"],
        },
      ]);
    }
    const sessionRes = await CreateSessionHelper({
      user: userExist,
    });
    if (!sessionRes?.success) {
      throw new ZodError([
        {
          code: "custom",
          message: "Session not created",
          path: ["email"],
        },
      ]);
    }
    // const emailRes = await SigninEmailFN({ user: userExist });
    // if (!emailRes?.success) {
    //   throw new ZodError([
    //     {
    //       code: "custom",
    //       message: "Email not sent",
    //       path: ["email"],
    //     },
    //   ]);
    // }
    return {
      success: true,
      data: {
        user: UserDTO(userExist),
      },
    };
  });
