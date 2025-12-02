import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (request)
    return NextResponse.json({
      title: "Events",
    });
}
