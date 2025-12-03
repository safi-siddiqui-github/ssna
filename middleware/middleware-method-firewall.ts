import { ActionResponseHelper, ResponseBodyType } from "@/lib/lib-responses";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

// Method Firewall
const allowedMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];

export default async function MiddlewareMethodFirewall(
  request: NextRequest,
): Promise<ResponseBodyType> {
  return await ActionResponseHelper(async () => {
    if (!allowedMethods.includes(request.method)) {
      // return new NextResponse("Method Not Allowed", { status: 405 });
      throw new ZodError([
        {
          code: "custom",
          path: ["method"],
          message: "Method Not Allowed",
        },
      ]);
    }
    return {
      success: true,
    };
  });
}
