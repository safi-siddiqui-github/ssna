import { bcryptCompareHelper } from "@/lib/bcryptjs";
import { ResponseHelper } from "@/lib/response";
import prisma from "@/prisma/database";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

export async function POST(request: Request) {
  return ResponseHelper(async () => {
    const body = await request.json();
    const formSchema = z.object({
      identifier: z.string().min(2),
      credential: z.string().min(8),
      remember: z.boolean(),
    });
    formSchema.parse(body);
    type bodyType = z.infer<typeof formSchema>;
    const { identifier, credential }: bodyType = body;
    const userExist = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
          {
            phone: identifier,
          },
        ],
      },
    });
    if (!userExist) {
      throw new ZodError([
        {
          code: "custom",
          path: ["identifier"],
          message: "Invalid identifier",
        },
      ]);
    }
    const compared = bcryptCompareHelper(
      credential,
      userExist?.password ?? "0",
    );
    if (!compared) {
      throw new ZodError([
        {
          code: "custom",
          path: ["credential"],
          message: "Incorrect credential",
        },
      ]);
    }
    userExist.password = null;
    // await EmailWelcomeUserFN({
    //   toAddress: userExist?.email,
    // });
    return NextResponse.json({
      success: true,
      // message: "Register Success",
      data: {
        user: userExist,
      },
    });
  });
}
