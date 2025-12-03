"use client";

import { Button } from "@/components/ui/button";
import { Routes } from "@/lib/lib-routes";
import { useUserStore } from "@/lib/lib-zustand";
import Link from "next/link";
import SignoutComponent from "./signout/SignoutComponent";

export default function HeaderComponent() {
  const userStore = useUserStore();
  return (
    <div className="flex justify-between p-4">
      <h2 className="text-xl">Header</h2>

      <div className="flex flex-col">
        {userStore?.user?.id ? (
          <SignoutComponent />
        ) : (
          <Button asChild>
            <Link href={Routes?.web?.guest?.signin}>Sign In</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
