import { ResendSendEmailHelper } from "@/lib/lib-resend";
import { ResponseBodyType, ResponseDataType } from "@/lib/lib-responses";

function EmailTemplate(props: ResponseDataType) {
  const { email } = props?.user ?? {};
  return (
    <div>
      <h1>Welcome again, {email}!</h1>
    </div>
  );
}

export const SigninEmailFN = async (
  arg: ResponseDataType,
): Promise<ResponseBodyType> => {
  return await ResendSendEmailHelper({
    payload: {
      from: "",
      subject: "Sign In",
      react: EmailTemplate(arg),
      to: [arg?.user?.email ?? ""],
    },
  });
};
