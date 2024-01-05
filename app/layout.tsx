import React from "react";

import "@/app/globals.css";
import Image from "next/image";
import { Analytics } from '@vercel/analytics/react';
import DiscordActivities from "@/app/components/DiscordActivities";

import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poppins",
});

export const metadata = {
  title: {
    default: "Cedrik Secic",
    template: "%s | Cedrik Secic",
  },
  description: "Cedrik's Personal Website",
  authors: [{ name: "Cedrik Secic" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        <div className={`h-screen`}>

          <Image
            src={`/profile.png`}
            alt={`background`}
            quality={100}
            fill
            sizes="100vw"
            className={`object-cover`}
          />

          <div
            className={`h-screen bg-[#16161A]/80 backdrop-blur-2xl`}
            style={{ boxShadow: "inset 0 0 20px 1px #141417" }}>

            {children}
            <Analytics />
            {/*<DiscordActivities />*/}

          </div>

        </div>
      </body>
    </html>
  );
}
