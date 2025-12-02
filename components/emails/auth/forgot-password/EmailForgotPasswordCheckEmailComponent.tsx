import {
  AwsSESSendEmail,
  AwsSESSendEmailPropsType,
  AwsSESSendEmailType,
} from "@/lib/aws-sdk";
import { OTP } from "@/prisma/generated/client";
import {
  Heading,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "@react-email/components";

export type EmailForgotPasswordCheckEmailType = {
  otp?: OTP;
};

const EmailForgotPasswordCheckEmailComponent = ({
  otp,
}: EmailForgotPasswordCheckEmailType) => {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
      }}
    >
      <Heading
        className="text-center"
        as="h2"
      >
        Forgot Passsword
      </Heading>
      <Text>Your OTP code is {otp?.token}</Text>
    </Tailwind>
  );
};

export const EmailForgotPasswordCheckEmailFN = async <
  T extends AwsSESSendEmailPropsType,
>(
  options: AwsSESSendEmailType<T>,
) => {
  await AwsSESSendEmail({
    ...options,
    subject: "Forgot Password",
    Component: EmailForgotPasswordCheckEmailComponent,
  });
};
