import type { Metadata } from "next";
import "./globals.css";
import { AppWrapper } from "../context";

export const metadata: Metadata = {
  title: "strangers chat",
  description: "chat one on one with strangers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
