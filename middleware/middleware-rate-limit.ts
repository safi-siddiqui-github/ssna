import { ActionResponseHelper, ResponseBodyType } from "@/lib/lib-responses";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

// IP Detection / Rate Limiting
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 1000; // Max 1000 requests per IP

export default async function MiddlewareRateLimit(
  request: NextRequest,
): Promise<ResponseBodyType> {
  return await ActionResponseHelper(async () => {
    const clientIp = request.headers.get("x-forwarded-for") ?? "unknown";
    const currentTime = Date.now();
    const rateLimitRecord = rateLimitStore.get(clientIp);
    if (rateLimitRecord) {
      const elapsedTime = currentTime - rateLimitRecord.lastRequestTime;
      if (elapsedTime < RATE_LIMIT_WINDOW_MS) {
        rateLimitRecord.requestCount += 1;
        if (rateLimitRecord.requestCount > RATE_LIMIT_MAX_REQUESTS) {
          //   return new NextResponse(
          //     JSON.stringify({
          //       error: `Too many requests. Please try again later.`,
          //     }),
          //     { status: 429, headers: { "Content-Type": "application/json" } },
          //   );
          throw new ZodError([
            {
              code: "custom",
              path: ["ip"],
              message: "Too many requests",
            },
          ]);
        }
      } else {
        rateLimitRecord.lastRequestTime = currentTime;
        rateLimitRecord.requestCount = 1;
      }
    } else {
      rateLimitStore.set(clientIp, {
        lastRequestTime: currentTime,
        requestCount: 1,
      });
    }
    return {
      success: true,
    };
  });
}
