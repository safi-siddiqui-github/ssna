"use client";

import {
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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { SignupAction } from "./action";
import { SignupSchema } from "./lib";

export default function SignupComponent() {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
    await ActionResponseHelper(async () => {
      const { email, password } = data;
      const formRes = await FormSubmitHelper(
        async () => await SignupAction({ user: { email, password } }),
        form,
      );
      if (formRes?.success) {
        toast.success("Signup Completed");
        router.push(Routes?.web?.guest?.signin);
      }
      return formRes;
    });
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <form
        className="flex w-full max-w-md flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="text-xl!">Create account</FieldLegend>
            <FieldDescription>Sign up account to get started</FieldDescription>
            <FieldGroup className="">
              <ControllerInputComponent
                form={form}
                name="email"
                label="Email"
                componentProps={{
                  placeholder: "Enter your email",
                }}
              />
              <ControllerInputComponent
                form={form}
                name="password"
                label="Password"
                componentProps={{
                  placeholder: "********",
                  type: "password",
                }}
              />
            </FieldGroup>
            <Field>
              <FormButtonComponent
                form={form}
                text="Sign Up"
              />
            </Field>
          </FieldSet>
        </FieldGroup>
      </form>
      <Link
        href={Routes.web.guest.signin}
        className="hover:underline"
      >
        Already have an Account? Sign In
      </Link>
    </div>
  );
}
