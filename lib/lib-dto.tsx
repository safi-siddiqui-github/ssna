// Data Transfer Object

import { ResponseDataType } from "@/types/types-responses";

export const UserDTO = (
  user?: ResponseDataType["user"],
): ResponseDataType["user"] => {
  return { ...user, password: null };
};
