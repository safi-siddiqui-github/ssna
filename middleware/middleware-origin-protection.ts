import { ActionResponseHelper, ResponseBodyType } from "@/lib/lib-responses";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

// Origin & Referrer Protection
const allowedOrigin = ["localhost:3000", "ssna.vercel.app"];

export default async function MiddlewareOriginProtection(
  request: NextRequest,
): Promise<ResponseBodyType> {
  return await ActionResponseHelper(async () => {
    //
    // Origin & Referrer Protection
    const origin = request.headers.get("host") || "";
    if (origin && !allowedOrigin.includes(origin)) {
      // return new NextResponse("Invalid origin", { status: 403 });
      throw new ZodError([
        {
          code: "custom",
          path: ["origin"],
          message: "Invalid Origin",
        },
      ]);
    }
    return {
      success: true,
    };
  });
}
