// import {
//   EmailEmailVerificationCheckEmailFN,
//   EmailEmailVerificationCheckEmailType,
// } from "@/components/emails/auth/email-verification/EmailEmailVerificationCheckEmailComponent";
// import { ResponseHelper } from "@/lib/lib-responses";
// import prisma from "@/prisma/database";
// import { addMinutes } from "date-fns";
// import { NextResponse } from "next/server";
// import { z, ZodError } from "zod";

// export async function POST(request: Request) {
//   return ResponseHelper(async () => {
//     const body = await request.json();
//     const formSchema = z.object({
//       email: z.email(),
//     });
//     formSchema.parse(body);
//     type bodyType = z.infer<typeof formSchema>;
//     const { email }: bodyType = body;
//     const userExist = await prisma.user.findFirst({
//       where: {
//         email,
//       },
//     });
//     if (!userExist) {
//       throw new ZodError([
//         {
//           code: "custom",
//           path: ["email"],
//           message: "Invalid Email",
//         },
//       ]);
//     }
//     // const existingOTP = await prisma.oTP.findFirst({
//     //   where: {
//     //     userId: userExist?.id,
//     //     user: {
//     //       email,
//     //     },
//     //   },
//     //   orderBy: {
//     //     createdAt: "desc",
//     //   },
//     // });
//     await prisma.oTP.deleteMany({
//       where: {
//         user: {
//           email,
//         },
//       },
//     });
//     const randomUUid = crypto.randomUUID();
//     const expiresAt = addMinutes(new Date(), 5);
//     const otp = await prisma.oTP.create({
//       data: {
//         userId: userExist?.id,
//         token: randomUUid,
//         expiresAt,
//       },
//     });
//     await EmailEmailVerificationCheckEmailFN({
//       toAddress: userExist?.email,
//       props: {
//         otp,
//       } satisfies EmailEmailVerificationCheckEmailType,
//     });
//     return NextResponse.json({
//       success: true,
//       data: {
//         // otp: otpExist,
//       },
//     });
//   });
// }
