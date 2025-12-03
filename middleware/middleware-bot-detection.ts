import { ActionResponseHelper, ResponseBodyType } from "@/lib/lib-responses";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

// Bot Detection
const badAgents = [
  "curl",
  "python",
  "wget",
  "scrapy",
  "axios",
  "java",
  "httpclient",
  "libwww",
  "go-http-client",
];

// curl http://localhost:3000

export default async function MiddlewareBotDetection(
  request: NextRequest,
): Promise<ResponseBodyType> {
  return await ActionResponseHelper(async () => {
    const ua = (request.headers.get("user-agent") || "unknown").toLowerCase();
    if (badAgents.some((bad) => ua.includes(bad))) {
      // return new NextResponse("Blocked bot", { status: 403 });
      throw new ZodError([
        {
          code: "custom",
          path: ["bot"],
          message: "Blocked Bot",
        },
      ]);
    }
    return {
      success: true,
    };
  });
}
