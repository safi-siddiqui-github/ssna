import { Toaster } from "@/components/ui/sonner";
import { CustomComponentType } from "@/types/types-component";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safi Siddiqui",
  description: "Safi Siddiqui Next.js App",
};

export default function RootLayout({ children }: CustomComponentType) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
