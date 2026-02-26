import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/context/provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Blog",
  description: "Create your posts and share your ideias",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Blog",
    description: "Create your posts and share your ideias",
    type: "website",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/favicon.svg`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: "Create your posts and share your ideias",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/favicon.svg`],
  },
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
