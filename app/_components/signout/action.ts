"use server";

import { ActionResponseHelper } from "@/lib/lib-responses";
import { DeleteSessionHelper } from "@/lib/lib-session";
import { ZodError } from "zod";

export const SignoutAction = async () =>
  ActionResponseHelper(async () => {
    const sessionRes = await DeleteSessionHelper();
    if (!sessionRes?.success) {
      throw new ZodError([
        {
          code: "custom",
          message: "Session not deleted",
          path: ["email"],
        },
      ]);
    }
    return {
      success: true,
      message: "Signout Completed",
    };
  });
