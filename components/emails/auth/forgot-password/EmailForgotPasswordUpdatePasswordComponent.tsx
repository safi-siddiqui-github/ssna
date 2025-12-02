// import {
//   AwsSESSendEmail,
//   AwsSESSendEmailPropsType,
//   AwsSESSendEmailType,
// } from "@/lib/lib-aws-sdk";
// import {
//   Heading,
//   Tailwind,
//   Text,
//   pixelBasedPreset,
// } from "@react-email/components";

// export type EmailForgotPasswordUpdatePasswordType = {
//   otp?: null;
// };

// const EmailForgotPasswordUpdatePasswordComponent =
//   ({}: EmailForgotPasswordUpdatePasswordType) => {
//     return (
//       <Tailwind
//         config={{
//           presets: [pixelBasedPreset],
//         }}
//       >
//         <Heading
//           className="text-center"
//           as="h2"
//         >
//           Passsword Updated
//         </Heading>
//         <Text>Your account password is updated</Text>
//       </Tailwind>
//     );
//   };

// export const EmailForgotPasswordUpdatePasswordFN = async <
//   T extends AwsSESSendEmailPropsType,
// >(
//   options: AwsSESSendEmailType<T>,
// ) => {
//   await AwsSESSendEmail({
//     ...options,
//     subject: "Password Updated",
//     Component: EmailForgotPasswordUpdatePasswordComponent,
//   });
// };
