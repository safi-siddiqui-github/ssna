"use client";

import { FormButtonComponent } from "@/components/form";
import { ActionResponseHelper } from "@/lib/lib-responses";
import { Routes } from "@/lib/lib-routes";
import { useUserStore } from "@/lib/lib-zustand";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SignoutAction } from "./action";

export default function SignoutComponent() {
  const userStore = useUserStore();
  const router = useRouter();
  const form = useForm();
  const onSubmit = async () => {
    await ActionResponseHelper(async () => {
      const signoutRes = await SignoutAction();
      if (signoutRes?.success) {
        userStore?.setUser(undefined);
        toast.success("Signout Completed");
        router.push(Routes?.web?.guest.signin);
      }
      return signoutRes;
    });
  };
  return (
    <form
      className="flex w-full max-w-md flex-col"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FormButtonComponent
        form={form}
        text="Sign Out"
      />
    </form>
  );
}
