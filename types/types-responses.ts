import { NextResponse } from "next/server";
import { $ZodIssue } from "zod/v4/core";
import {
  OrNull,
  OTPFullModel,
  SessionFullModel,
  UserFullModel,
} from "./types-models";

export type ResponseDataType = {
  user?: OrNull<UserFullModel>;
  session?: OrNull<SessionFullModel>;
  otp?: OrNull<OTPFullModel>;
};

export type ResponseBodyType = {
  success: boolean;
  message?: string;
  data?: ResponseDataType;
  error?: {
    type: "zod" | "prisma" | "axios" | "unknown";
    message: string;
    details?: $ZodIssue[];
  };
};

export type ApiResponseBodyType = NextResponse<ResponseBodyType>;

// export type AxiosResponseType<T = AxiosResponseDataType> = AxiosResponse<T>;
// export type AxiosErrorType<T = AxiosResponseDataType> = AxiosError<T>;

// export type RouteResponseType =
//   | NextResponse<AxiosResponseDataType>
//   | NextResponse;

export type AmplifyErrorType = {
  name?:
    | "AuthUserPoolException"
    | "UsernameExistsException"
    | "InvalidPasswordException"
    | "InvalidPasswordException"
    | "UserUnAuthenticatedException"
    | "EmptyConfirmSignUpCode"
    | "CodeMismatchException"
    | "NotAuthorizedException"
    | "";
  message?: string;
};
