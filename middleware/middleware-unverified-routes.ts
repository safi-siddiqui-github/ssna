import { JoseDecryptHelper } from "@/lib/lib-jose";
import { ActionResponseHelper, ResponseBodyType } from "@/lib/lib-responses";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

const unverifiedRoutes = [
  "/abcdefg",
  // Routes.web.auth.emailVerificationCheckEmail,
  // Routes.web.auth.dashboardEvents,
];
export default async function MiddlewareUnverifiedRoutes(
  request: NextRequest,
): Promise<ResponseBodyType> {
  return await ActionResponseHelper(async () => {
    const { pathname } = request.nextUrl;
    const userCookie = request.cookies?.get(
      process?.env?.USER_SESSION_NAME ?? "false",
    )?.value;
    const userDecrypt = await JoseDecryptHelper(userCookie);
    if (
      unverifiedRoutes.some((prefix) => pathname.startsWith(prefix)) &&
      userDecrypt?.isVerified
    ) {
      throw new ZodError([
        {
          code: "custom",
          path: ["unverified-route"],
          message: "Invalid Access",
        },
      ]);
    }
    return {
      success: true,
    };
  });
}
