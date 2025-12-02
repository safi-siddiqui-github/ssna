// import {
//   AwsSESSendEmail,
//   AwsSESSendEmailPropsType,
//   AwsSESSendEmailType,
// } from "@/lib/lib-aws-sdk";
// import { User } from "@/prisma/generated/client";
// import {
//   Heading,
//   Tailwind,
//   Text,
//   pixelBasedPreset,
// } from "@react-email/components";

// export type EmailEmailVerificationWelcomeUserType = {
//   user?: User;
// };

// const EmailEmailVerificationWelcomeUserComponent = ({
//   user,
// }: EmailEmailVerificationWelcomeUserType) => {
//   return (
//     <Tailwind
//       config={{
//         presets: [pixelBasedPreset],
//       }}
//     >
//       <Heading
//         className="text-center"
//         as="h2"
//       >
//         Welcome to EventVerse
//       </Heading>
//       <Text>Hi {user?.firstname},</Text>
//       <Text>Join the worlds largest event platform</Text>
//     </Tailwind>
//   );
// };

// export const EmailEmailVerificationWelcomeUserFN = async <
//   T extends AwsSESSendEmailPropsType,
// >(
//   options: AwsSESSendEmailType<T>,
// ) => {
//   await AwsSESSendEmail({
//     ...options,
//     subject: "Welcome User",
//     Component: EmailEmailVerificationWelcomeUserComponent,
//   });
// };
