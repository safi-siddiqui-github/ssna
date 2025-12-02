// import {
//   EmailEmailVerificationWelcomeUserFN,
//   EmailEmailVerificationWelcomeUserType,
// } from "@/components/emails/auth/email-verification/EmailEmailVerificationWelcomeUserComponent";
// import { ResponseHelper } from "@/lib/lib-responses";
// import prisma from "@/prisma/database";
// import { isAfter } from "date-fns";
// import { NextResponse } from "next/server";
// import { z, ZodError } from "zod";

// export async function POST(request: Request) {
//   return ResponseHelper(async () => {
//     const body = await request.json();
//     const formSchema = z.object({
//       email: z.email(),
//       token: z.string().min(10),
//     });
//     formSchema.parse(body);
//     type bodyType = z.infer<typeof formSchema>;
//     const { email, token }: bodyType = body;
//     const otpExist = await prisma.oTP.findFirst({
//       where: {
//         token,
//       },
//       include: {
//         user: true,
//       },
//     });
//     if (!otpExist) {
//       throw new ZodError([
//         {
//           code: "custom",
//           path: ["token"],
//           message: "Invalid token",
//         },
//       ]);
//     }
//     if (email !== otpExist?.user?.email) {
//       throw new ZodError([
//         {
//           code: "custom",
//           path: ["email"],
//           message: "Invalid email",
//         },
//       ]);
//     }
//     if (!isAfter(otpExist?.expiresAt ?? "", new Date())) {
//       throw new ZodError([
//         {
//           code: "custom",
//           path: ["token"],
//           message: "Invalid token",
//         },
//       ]);
//     }
//     const userVerify = await prisma.user.update({
//       where: {
//         email,
//       },
//       data: {
//         emailVerified: true,
//       },
//     });
//     if (!userVerify) {
//       throw new ZodError([
//         {
//           code: "custom",
//           path: ["email"],
//           message: "Invalid email",
//         },
//       ]);
//     }
//     await prisma.oTP.delete({
//       where: {
//         id: otpExist?.id,
//       },
//     });
//     await EmailEmailVerificationWelcomeUserFN({
//       toAddress: userVerify?.email,
//       props: {
//         user: userVerify,
//       } satisfies EmailEmailVerificationWelcomeUserType,
//     });
//     return NextResponse.json({
//       success: true,
//       data: {
//         user: userVerify,
//       },
//     });
//   });
// }
