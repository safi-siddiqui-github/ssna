import { ApiResponseBodyType, ResponseBodyType } from "@/types/types-responses";
import { NextResponse } from "next/server";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { ZodError } from "zod";

export const ActionResponseHelper = async (
  callback: () => Promise<ResponseBodyType>,
): Promise<ResponseBodyType> => {
  try {
    return await callback();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: {
          type: "zod",
          message: "Validation failed",
          details: error.issues,
        },
      };
    } else if (
      error instanceof Error &&
      error.constructor?.name?.startsWith("Prisma")
    ) {
      return {
        success: false,
        error: {
          type: "prisma",
          message: error.message,
        },
      };
    }
    return {
      success: false,
      error: {
        type: "unknown",
        message: "An unknown error occurred",
      },
    };
  }
};

export const ApiResponseHelper = async (
  callback: () => Promise<ApiResponseBodyType>,
): Promise<ApiResponseBodyType> => {
  try {
    return await callback();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          type: "zod",
          message: "Validation failed",
          details: error.issues,
        },
      });
    } else if (
      error instanceof Error &&
      error.constructor?.name?.startsWith("Prisma")
    ) {
      return NextResponse.json({
        success: false,
        error: {
          type: "prisma",
          message: error.message,
        },
      });
    }
    return NextResponse.json({
      success: false,
      error: {
        type: "unknown",
        message: "An unknown error occurred",
      },
    });
  }
};

export const FormSubmitHelper = async <TFieldValues extends FieldValues>(
  callback: () => Promise<ResponseBodyType>,
  form: UseFormReturn<TFieldValues>,
): Promise<ResponseBodyType> => {
  try {
    const response = await callback();
    if (!response?.success) {
      for (const detail of response?.error?.details ?? []) {
        form.setError(detail?.path[0] as Path<TFieldValues>, detail);
      }
    }
    return response;
  } catch (error: unknown) {
    const cue = error as Error;
    return {
      success: false,
      error: {
        type: "unknown",
        message: cue?.message,
      },
    };
  }
};

// const unknownError: AxiosResponseDataType = {
//   success: false,
// };

// export const ApiResponseHelper = async (
//   callback: () => Promise<AxiosResponseType>,
// ): Promise<AxiosResponseDataType> => {
//   try {
//     const response = await callback();
//     return response?.data;
//   } catch (error: unknown) {
//     if (isAxiosError<AxiosResponseDataType>(error)) {
//       return error?.response?.data ?? unknownError;
//     }
//     return unknownError;
//     // throw error;
//   }
// };

// export const AmplifyResponseHelper = async <T>(
//   callback: () => Promise<T>,
// ): Promise<AmplifyResponseDataType<T>> => {
//   try {
//     const response = await callback();
//     return { success: true, amplifyData: response };
//   } catch (error: unknown) {
//     const ampError = error as AmplifyErrorType;

//     const errObj: AmplifyResponseDataType<T> = {
//       success: false,
//       error: {
//         type: "zod",
//         message: "Amplify Error",
//         details: [],
//       },
//     };
//     const zodIssueObj: $ZodIssue = {
//       code: "custom",
//       message: ampError?.message ?? "",
//       path: [""],
//     };
//     // console.log(ampError);
//     switch (ampError?.name) {
//       case "AuthUserPoolException":
//         zodIssueObj.path[0] = "email";
//         errObj?.error?.details?.push(zodIssueObj);
//         break;
//       case "UsernameExistsException":
//         zodIssueObj.path[0] = "email";
//         errObj?.error?.details?.push(zodIssueObj);
//         break;
//       case "InvalidPasswordException":
//         zodIssueObj.path[0] = "password";
//         errObj?.error?.details?.push(zodIssueObj);
//         break;
//       case "UserUnAuthenticatedException":
//         zodIssueObj.path[0] = "email";
//         errObj?.error?.details?.push(zodIssueObj);
//         break;
//       case "EmptyConfirmSignUpCode":
//         zodIssueObj.path[0] = "token";
//         errObj?.error?.details?.push(zodIssueObj);
//         break;
//       case "CodeMismatchException":
//         zodIssueObj.path[0] = "token";
//         errObj?.error?.details?.push(zodIssueObj);
//         break;
//       case "NotAuthorizedException":
//         zodIssueObj.path[0] = "identifier";
//         errObj?.error?.details?.push(zodIssueObj);
//         break;
//     }
//     return errObj;
//   }
// };

// const unknownError: ActionResponseType = {
// 	success: false,
// 	error: {
// 		type: "unknown",
// 		message: "An unknown error occurred",
// 	},
// };

// export const ActionResponseHelper = async (
// 	callback: () => Promise<ActionResponseType>,
// ): Promise<ActionResponseType> => {
// 	try {
// 		//
// 		return await callback();
// 		//
// 	} catch (error: unknown) {
// 		//
// 		if (error instanceof ZodError) {
// 			return {
// 				success: false,
// 				error: {
// 					type: "zod",
// 					message: "Validation failed",
// 					details: error.issues,
// 				},
// 			};
// 		}
// 		//
// 		if (
// 			error instanceof Error &&
// 			error.constructor?.name?.startsWith("Prisma")
// 		) {
// 			return {
// 				success: false,
// 				error: {
// 					type: "prisma",
// 					message: error.message,
// 				},
// 			};
// 		}
// 		//
// 		return unknownError;
// 		//
// 	}
// 	//
// };

// export const FormSubmitHelper = async <TFieldValues extends FieldValues>(
// 	callback: () => Promise<ActionResponseType>,
// 	form: UseFormReturn<TFieldValues>,
// ): Promise<ActionResponseType> => {
// 	try {
// 		//
// 		const response = await callback();
// 		//
// 		if (!response?.success) {
// 			//
// 			for (const detail of response?.error?.details ?? []) {
// 				//
// 				form.setError(detail?.path[0] as Path<TFieldValues>, detail);
// 				//
// 			}
// 			//
// 		}
// 		//
// 		return response;
// 		//
// 	} catch (error: unknown) {
// 		//
// 		return unknownError;
// 		//
// 		if (error) {
// 		}
// 		//
// 	}
// 	//
// };
