// import { ResponseHelper } from "@/lib/lib-responses";
// import prisma from "@/prisma/database";
// import { NextResponse } from "next/server";
// import { z } from "zod";

// export async function POST(request: Request) {
//   return ResponseHelper(async () => {
//     const body = await request.json();
//     const formSchema = z.object({
//       id: z.number().min(1),
//     });
//     formSchema.parse(body);
//     type bodyType = z.infer<typeof formSchema>;
//     const { id }: bodyType = body;
//     const session = await prisma.session.findUnique({
//       where: {
//         id,
//       },
//       include: {
//         user: true,
//       },
//     });
//     return NextResponse.json({
//       success: true,
//       data: {
//         session,
//       },
//     });
//   });
// }
