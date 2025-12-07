"use client";

import { Spinner } from "@/components/ui/spinner";
import { Routes } from "@/lib/lib-routes";
import { VerifySessionHelper } from "@/lib/lib-session";
import { useUserStore } from "@/lib/lib-zustand";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect } from "react";
import { toast } from "sonner";

export function SocialLoginResponseComponent() {
  return (
    <div className="">
      <Suspense>
        <SocialLoginResponseForm />
      </Suspense>
    </div>
  );
}

function SocialLoginResponseForm() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const params = useSearchParams();
  const email = params?.get("email");

  const signUserIn = useCallback(async () => {
    const session = await VerifySessionHelper();
    if (session?.success && email === session?.data?.session?.user?.email) {
      setUser(session?.data?.session?.user);
      router?.push(Routes.web?.auth?.dashboard);
      toast("Login Success");
    } else {
      router?.push(Routes.web?.general?.home);
    }
  }, [email, router, setUser]);
  useEffect(() => {
    signUserIn();
  }, [signUserIn]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="flex flex-col">
        <p className="text-xl">Social Login</p>
        <p className="">Logging user in</p>
      </div>
      <Spinner />
    </div>
  );
}
