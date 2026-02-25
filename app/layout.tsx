import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/context/provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Blog",
  description: "Create your posts and share your ideias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-satoshi antialiased`}>
        <Provider>{children}</Provider>
        <Toaster richColors />
      </body>
    </html>
  );
}
