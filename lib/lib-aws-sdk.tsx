// import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
// import { render } from "@react-email/render";
// import { ComponentType } from "react";
// import EmailEmptyEmailComponent from "../emails/placeholder/EmptyEmail";

// const accessKeyId = process.env.AAWS_ACCESS_KEY ?? "";
// const secretAccessKey = process.env.AAWS_SECRET_ACCESS_KEY ?? "";
// const region = process.env.AAWS_REGION;
// const mailAddress = process.env.AAWS_MAIL_ADDRESS;

// const AwsSESClient = new SESClient({
//   region,
//   credentials: {
//     accessKeyId,
//     secretAccessKey,
//   },
// });

// export type AwsSESSendEmailPropsType = Record<string, unknown>;

// export type AwsSESSendEmailType<
//   T extends AwsSESSendEmailPropsType = AwsSESSendEmailPropsType,
// > = {
//   subject?: string | null;
//   toAddress?: string | string[] | null;
//   fromAddress?: string | null;
//   Component?: ComponentType<T> | null;
//   props?: Partial<T>;
// };

// const subjectPlaceholder = "Empty Email";
// const toAddressPlaceholder = mailAddress ?? "judeedwards55@gmail.com";
// const fromAddressPlaceholder = mailAddress ?? "judeedwards24@gmail.com";
// const ComponentPlaceholder = EmailEmptyEmailComponent;
// const Charset = "UTF-8";

// export const AwsSESSendEmail = async <T extends AwsSESSendEmailPropsType>({
//   subject = subjectPlaceholder,
//   toAddress = toAddressPlaceholder,
//   Component = ComponentPlaceholder,
//   props = {},
//   fromAddress = fromAddressPlaceholder,
// }: AwsSESSendEmailType<T>) => {
//   const element = Component ? (
//     <Component {...(props as T)} />
//   ) : (
//     <ComponentPlaceholder />
//   );
//   const emailHtml = await render(element);
//   const command = new SendEmailCommand({
//     Source: fromAddress ?? mailAddress,
//     Destination: {
//       ToAddresses: toAddress
//         ? Array.isArray(toAddress)
//           ? toAddress
//           : [toAddress]
//         : [toAddressPlaceholder],
//     },
//     Message: {
//       Subject: { Data: subject ?? subjectPlaceholder, Charset },
//       Body: {
//         Html: { Data: emailHtml, Charset },
//       },
//     },
//   });
//   return AwsSESClient.send(command);
// };
