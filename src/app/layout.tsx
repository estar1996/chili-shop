import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster as UIToaster } from "@/components/ui/toaster";
import SupabaseProvider from "@/components/SupabaseProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "명품 고춧가루",
  description: "최고 품질의 국내산 고춧가루를 만나보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
        <UIToaster />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
