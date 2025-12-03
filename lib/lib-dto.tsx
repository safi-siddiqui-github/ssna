// Data Transfer Object

import { ResponseDataType } from "./lib-responses";

export const UserDTO = (
  user?: ResponseDataType["user"],
): ResponseDataType["user"] => {
  return { ...user, password: null };
};
