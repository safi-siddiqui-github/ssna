import { ActionResponseHelper, ResponseBodyType } from "@/lib/lib-responses";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

//  Path Firewall
const blockedPaths = [
  "/phpmyadmin",
  "/wp-admin",
  "/.env",
  "/config",
  "/server-status",
  "/admin",
];

export default async function MiddlewarePathFirewall(
  request: NextRequest,
): Promise<ResponseBodyType> {
  return await ActionResponseHelper(async () => {
    //
    // Path Firewall
    const url = new URL(request.url);
    if (blockedPaths.some((path) => url.pathname.startsWith(path))) {
      // return new NextResponse("Forbidden", { status: 403 });
      throw new ZodError([
        {
          code: "custom",
          path: ["path"],
          message: "Forbidden",
        },
      ]);
    }
    return {
      success: true,
    };
  });
}
