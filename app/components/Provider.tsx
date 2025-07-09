"use client";

import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ImageKitProvider urlEndpoint={urlEndPoint}>
          {children}
        </ImageKitProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
