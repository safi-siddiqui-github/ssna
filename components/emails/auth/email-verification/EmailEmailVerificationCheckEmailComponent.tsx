// import {
//   AwsSESSendEmail,
//   AwsSESSendEmailPropsType,
//   AwsSESSendEmailType,
// } from "@/lib/lib-aws-sdk";
// import { OTP } from "@/prisma/generated/client";
// import {
//   Heading,
//   Tailwind,
//   Text,
//   pixelBasedPreset,
// } from "@react-email/components";

// export type EmailEmailVerificationCheckEmailType = {
//   otp?: OTP;
// };

// const EmailEmailVerificationCheckEmailComponent = ({
//   otp,
// }: EmailEmailVerificationCheckEmailType) => {
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
//         Email Verification
//       </Heading>
//       <Text>Your OTP code is {otp?.token}</Text>
//     </Tailwind>
//   );
// };

// export const EmailEmailVerificationCheckEmailFN = async <
//   T extends AwsSESSendEmailPropsType,
// >(
//   options: AwsSESSendEmailType<T>,
// ) => {
//   await AwsSESSendEmail({
//     ...options,
//     subject: "Email Verification",
//     Component: EmailEmailVerificationCheckEmailComponent,
//   });
// };
