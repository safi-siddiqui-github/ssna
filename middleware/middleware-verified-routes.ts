import { JoseDecryptHelper } from "@/lib/lib-jose";
import { ActionResponseHelper, ResponseBodyType } from "@/lib/lib-responses";
import { Routes } from "@/lib/lib-routes";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

const verifiedRoutes = [
  Routes.web.auth.dashboard,
  // Routes.web.auth.dashboardEvents,
];
export default async function MiddlewareVerifiedRoutes(
  request: NextRequest,
): Promise<ResponseBodyType> {
  return await ActionResponseHelper(async () => {
    const { pathname } = request.nextUrl;
    const userCookie = request.cookies?.get(
      process?.env?.USER_SESSION_NAME ?? "false",
    )?.value;
    const userDecrypt = await JoseDecryptHelper(userCookie);
    if (
      verifiedRoutes.some((prefix) => pathname.startsWith(prefix)) &&
      !userDecrypt?.isVerified
    ) {
      throw new ZodError([
        {
          code: "custom",
          path: ["verified-route"],
          message: "Invalid Access",
        },
      ]);
    }
    return {
      success: true,
    };
  });
}
