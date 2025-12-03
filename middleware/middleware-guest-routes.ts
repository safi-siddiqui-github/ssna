import { ActionResponseHelper, ResponseBodyType } from "@/lib/lib-responses";
import { Routes } from "@/lib/lib-routes";
import { GetCookieHelper } from "@/lib/lib-session";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

const guestRoutes = [
  Routes.web.guest.signin,
  Routes.web.guest.signup,
  Routes.web.guest.forgotPasswordCheckEmail,
  Routes.web.guest.forgotPasswordUpdatePassword,
  Routes.web.guest.emailVerificationCheckEmail,
];

export default async function MiddlewareGuestRoutes(
  request: NextRequest,
): Promise<ResponseBodyType> {
  return await ActionResponseHelper(async () => {
    const { pathname } = request.nextUrl;
    const userCookie = await GetCookieHelper();
    // const userCookie = request.cookies?.get(
    //   process?.env?.USER_SESSION_NAME ?? "false",
    // )?.value;
    // console.log(userCookie, "asd", process?.env?.USER_SESSION_NAME);
    // const userDecrypt = await decryptHelper(userCookie);
    // if (
    // 	guestRoutes.some((prefix) => pathname.startsWith(prefix)) &&
    // 	userDecrypt?.sessionId
    // ) {

    // console.log(
    //   "guest",
    //   pathname,
    //   userCookie,
    //   guestRoutes.some((prefix) => pathname.startsWith(prefix)) && userCookie,
    // );

    if (
      guestRoutes.some((prefix) => pathname.startsWith(prefix)) &&
      userCookie
    ) {
      throw new ZodError([
        {
          code: "custom",
          path: ["guest-route"],
          message: "Invalid Access",
        },
      ]);
    }
    return {
      success: true,
    };
  });
}
