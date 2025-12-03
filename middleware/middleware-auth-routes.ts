import { ActionResponseHelper, ResponseBodyType } from "@/lib/lib-responses";
import { Routes } from "@/lib/lib-routes";
import { GetCookieHelper } from "@/lib/lib-session";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

const protectedRoutes = [
  Routes.web.auth.dashboard,
  // Routes.web.auth.dashboardEvents,
];
export default async function MiddlewareAuthRoutes(
  request: NextRequest,
): Promise<ResponseBodyType> {
  return await ActionResponseHelper(async () => {
    const { pathname } = request.nextUrl;
    const userCookie = await GetCookieHelper();
    // const userCookie = request.cookies?.get(
    //   process?.env?.USER_SESSION_NAME ?? "false",
    // )?.value;
    // const userDecrypt = await decryptHelper(userCookie);
    // if (
    // 	protectedRoutes.some((prefix) => pathname.startsWith(prefix)) &&
    // 	!userDecrypt?.sessionId
    // ) {

    if (
      protectedRoutes.some((prefix) => pathname.startsWith(prefix)) &&
      !userCookie
    ) {
      throw new ZodError([
        {
          code: "custom",
          path: ["auth-route"],
          message: "Invalid Access",
        },
      ]);
    }
    return {
      success: true,
    };
  });
}
