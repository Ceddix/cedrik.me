import React from "react";

import Image from "next/image";
import TypeWriter from "@/app/components/TypeWriter";
import SocialLinks from "@/app/components/SocialLinks";
import PageWrapper from "@/app/components/PageWrapper";
import AboutButton from "@/app/components/AboutButton";
import DiscordStatus from "@/app/components/DiscordStatus";
import { age } from "@/app/components/Constants";

import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poppins",
});

export default function Home() {
  return (
    // Navbar (delay with text)
    // Activity

    <>
      <PageWrapper>
        <main
          className={
            "flex min-h-[70vh] flex-col items-center justify-center text-center"
          }
        >
          <div className="relative mb-2.5 transform cursor-pointer transition duration-500 hover:scale-105">
            <Image
              src={`/profile.png`}
              alt={`profile`}
              className={`rounded-full border-[8px] border-zinc-800 object-cover`}
              quality={100}
              width={170}
              height={170}
            />

            <DiscordStatus />
          </div>

          <h1 className={`pb-1 text-3xl font-bold`}>Cedrik Secic</h1>

          <TypeWriter
            text={`Hi, I'm Cedrik! I'm a ${age.toString()} y/o student from Belgium!`}
            typeSpeed={80}
            startDelay={500}
            className={`text-[18px] text-gray-400`}
          />

          <SocialLinks />

          <AboutButton />
        </main>
      </PageWrapper>
    </>
  );
}
