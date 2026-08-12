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
      <body className={`font-sans`}>
        <div className={`relative min-h-screen`}>

          <Image
            src={`/profile.png`}
            alt={`background`}
            quality={100}
            fill
            priority
            loading="eager"
            sizes="100vw"
            className={`object-cover`}
          />

          <div
            className={`min-h-screen bg-[#16161A]/80 backdrop-blur-2xl overflow-y-auto`}
            style={{ boxShadow: "inset 0 0 20px 1px #141417" }}>

            {children}
            <Analytics />

          </div>

        </div>
      </body>
    </html>
  );
}
