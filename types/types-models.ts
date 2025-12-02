import { OTP, Session, User } from "@/prisma/generated/prisma/client";

export type OrNull<T> = T | null;
export type OrPartialNull<T> = Partial<T> | null;

export type SessionFullModel = Partial<Session> & {
  user?: OrPartialNull<User>;
};

export type UserFullModel = Partial<User> & {
  sessions?: OrPartialNull<Session[]>;
};

export type OTPFullModel = Partial<OTP> & {
  user?: OrPartialNull<User>;
};
