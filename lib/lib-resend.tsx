import {
  CreateEmailOptions,
  CreateEmailRequestOptions,
  CreateEmailResponse,
  Resend,
} from "resend";
import { ZodError } from "zod";
import {
  ActionResponseHelper,
  ResponseBodyType,
  ResponseDataType,
} from "./lib-responses";

const ResendCLient = new Resend(process.env.RESEND_API_KEY);

function EmailTemplate() {
  return (
    <div>
      <h1>Error </h1>
      <p>Problem while sending email</p>
    </div>
  );
}

export type ResendSendEmailBodyType = {
  payload?: CreateEmailOptions;
  options?: CreateEmailRequestOptions;
};

export type ResendSendEmailResponseType = CreateEmailResponse;

export const ResendSendEmailHelper = async (
  arg?: ResponseDataType["resendSendBody"],
): Promise<ResponseBodyType> => {
  return await ActionResponseHelper(async () => {
    const { payload, options } = arg ?? {};
    const resendRes = await ResendCLient.emails.send(
      (payload && {
        ...payload,
        from: "Acme <onboarding@resend.dev>",
      }) ?? {
        from: "Acme <onboarding@resend.dev>",
        to: "safisiddiqui.work@gmail.com",
        react: EmailTemplate(),
        subject: "Error",
      },
      options,
    );
    if (resendRes?.error) {
      throw new ZodError([
        {
          code: "custom",
          message: resendRes?.error?.message,
          path: ["resend_error"],
        },
      ]);
    }
    if (resendRes?.data?.id) {
      return {
        success: true,
        message: "Email Sent",
        data: {
          resendSendRes: resendRes,
        },
      };
    }
    throw new ZodError([
      {
        code: "custom",
        message: "Unknown Error",
        path: ["resend_error"],
      },
    ]);
  });
};
