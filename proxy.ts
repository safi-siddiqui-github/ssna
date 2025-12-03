import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";
import { ApiResponseHelper } from "./lib/lib-responses";
import { Routes } from "./lib/lib-routes";
import MiddlewareAuthRoutes from "./middleware/middleware-auth-routes";
import MiddlewareBotDetection from "./middleware/middleware-bot-detection";
import MiddlewareGuestRoutes from "./middleware/middleware-guest-routes";
import MiddlewareMethodFirewall from "./middleware/middleware-method-firewall";
import MiddlewareOriginProtection from "./middleware/middleware-origin-protection";
import MiddlewarePathFirewall from "./middleware/middleware-path-firewall";
import MiddlewareRateLimit from "./middleware/middleware-rate-limit";

export async function proxy(request: NextRequest) {
  // initAmplifyServer();

  return await ApiResponseHelper(async () => {
    for (const middleware of [
      MiddlewareMethodFirewall,
      MiddlewareOriginProtection,
      MiddlewareBotDetection,
      MiddlewarePathFirewall,
      MiddlewareRateLimit,
    ]) {
      await middleware(request).then((res) => {
        if (!res?.success) throw new ZodError(res?.error?.details ?? []);
      });
    }

    const mgr = await MiddlewareGuestRoutes(request);
    if (!mgr?.success) {
      return NextResponse.redirect(
        new URL(Routes.web.general.home, request.url),
      );
    }

    const mar = await MiddlewareAuthRoutes(request);
    if (!mar?.success) {
      return NextResponse.redirect(
        new URL(Routes.web.guest.signin, request.url),
      );
    }

    // const mvr = await MiddlewareVerifiedRoutes(request);
    // if (!mvr?.success) {
    // 	return NextResponse.redirect(
    // 		new URL(Routes.web.guest.emailVerificationCheckEmail, request.url),
    // 	);
    // }

    // const mur = await MiddlewareUnverifiedRoutes(request);
    // if (!mur?.success) {
    // 	return NextResponse.redirect(
    // 		new URL(Routes.web.auth.dashboard, request.url),
    // 	);
    // }

    // showHeaders(request)
    // showCookies(request)
    return NextResponse.next();
  });
}

// const showHeaders = (request: NextRequest) => {
//   request.headers.entries().forEach((a) => {
//     console.log(a);
//   });
// };

// const showCookies = (request: NextRequest) => {
//   console.log(request.cookies);
// };
