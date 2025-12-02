import { ResponseType } from "@/type";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

const unknownError: ResponseType = NextResponse.json({
  success: false,
  error: {
    type: "unknown",
    message: "An unknown error occurred",
  },
});

export const ResponseHelper = async (
  callback: () => Promise<ResponseType>,
): Promise<ResponseType> => {
  try {
    return await callback();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          type: "zod",
          message: "Validation failed",
          details: error.issues,
        },
      });
    } else if (
      error instanceof Error &&
      error.constructor?.name?.startsWith("Prisma")
    ) {
      return NextResponse.json({
        success: false,
        error: {
          type: "prisma",
          message: error.message,
        },
      });
    }
    return unknownError;
  }
};
