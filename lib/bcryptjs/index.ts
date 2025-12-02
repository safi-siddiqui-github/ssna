import bcrypt from "bcryptjs";

export const bcryptHashHelper = async (text?: string): Promise<string> => {
  const saltRound = Number(process?.env?.HASH_SALT_ROUND);
  const salt = await bcrypt.genSalt(saltRound ?? 10);
  return await bcrypt.hash(text ?? "0", salt);
};

export const bcryptCompareHelper = async (
  text?: string,
  hashed?: string,
): Promise<boolean> => {
  return await bcrypt.compare(text ?? "0", hashed ?? "1");
};
