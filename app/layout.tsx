import type { ReactNode } from "react";

import "@/app/globals.css";
import Image from "next/image";
import { Analytics } from '@vercel/analytics/react';

import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poppins",
});

export const metadata = {
  metadataBase: new URL('https://cedrik.me'),
  title: {
    default: "Cedrik Secic",
    template: "%s | Cedrik Secic",
  },
  description: "My personal website.",
  authors: [{ name: "Cedrik Secic" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [
      {
        url: "/profile.png"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable}`} data-scroll-behavior="smooth">
      <body className="font-sans bg-[#16161A]">
        {/* Fixed background image with backdrop blur layer */}
        <div className="fixed -inset-10 pointer-events-none overflow-hidden z-0">
          <Image
            src="/profile.png"
            alt="background"
            quality={100}
            fill
            priority
            loading="eager"
            sizes="120vw"
            className="object-cover scale-110"
          />
          <div
            className="absolute inset-0 bg-[#16161A]/80 backdrop-blur-2xl"
            style={{ boxShadow: "inset 0 0 20px 1px #141417" }}
          />
        </div>

        <div className="relative z-10 min-h-[100dvh]">
          {children}
          <Analytics />
        </div>

      </body>
    </html>
  );
}
