"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import {
  ControllerCheckboxComponent,
  ControllerInputComponent,
  FormButtonComponent,
} from "@/components/form";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { ActionResponseHelper, FormSubmitHelper } from "@/lib/lib-responses";
import { Routes } from "@/lib/lib-routes";
import { useUserStore } from "@/lib/lib-zustand";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SocialLoginComponent from "../../_components/SocialLoginComponent";
import { SigninAction } from "./action";
import { SigninSchema } from "./lib";

export default function SigninComponent() {
  const router = useRouter();
  const userStore = useUserStore();
  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });
  const onSubmit = async (data: z.infer<typeof SigninSchema>) => {
    await ActionResponseHelper(async () => {
      const { email, password } = data;
      const formRes = await FormSubmitHelper(
        async () => await SigninAction({ user: { email, password } }),
        form,
      );
      if (formRes?.success) {
        userStore?.setUser(formRes?.data?.user);
        toast.success("Signin Completed");
        router.push(Routes?.web?.auth.dashboard);
      }
      return formRes;
    });
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <div className="flex w-full max-w-md flex-col gap-4">
        <form
          className="flex flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="text-xl!">Welcome back</FieldLegend>
              <FieldDescription>
                Sign in to your account to continue
              </FieldDescription>
              <FieldGroup className="">
                <ControllerInputComponent
                  form={form}
                  name="email"
                  label="Email / Username"
                  componentProps={{
                    placeholder: "Enter identifier",
                  }}
                />
                <Field>
                  <ControllerInputComponent
                    form={form}
                    name="password"
                    label="Password"
                    componentProps={{
                      placeholder: "********",
                      type: "password",
                    }}
                  />
                  <Link
                    className="hover:underline"
                    href={Routes.web.guest.forgotPasswordCheckEmail}
                  >
                    Forgot Password?
                  </Link>
                </Field>
                <ControllerCheckboxComponent
                  form={form}
                  name="remember"
                  label="Remember Me"
                />
              </FieldGroup>
              <Field>
                <FormButtonComponent
                  form={form}
                  text="Sign In"
                />
              </Field>
            </FieldSet>
          </FieldGroup>
        </form>
        <Link
          href={Routes.web.guest.signup}
          className="text-center hover:underline"
        >
          Dont have an Account? Sign Up
        </Link>
        <SocialLoginComponent />
      </div>
    </div>
  );
}
