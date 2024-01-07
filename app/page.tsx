import React from "react";

import Image from "next/image";
import Link from "next/link";
import PageWrapper from "@/app/components/PageWrapper";

import SocialLinks from "@/app/components/ui/SocialLinks";
import DiscordStatus from "@/app/components/ui/DiscordStatus";
import { age } from "@/app/components/Constants";
import { TbArrowNarrowRight } from "react-icons/tb";

export default function Home() {
  return (
    // Activity

    <>
      <PageWrapper>
        <main className={`flex min-h-[70vh] flex-col justify-center items-center text-center`}>
          <div className={`relative mb-2.5 transform cursor-pointer transition duration-500 hover:scale-105`}>

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

          <h1 className={`pb-1 text-3xl font-bold`}>Cedrik Secic <span className={`text-2xl text-gray-300`}>(he/him)</span></h1>

          <div className={`text-[1.2rem] text-gray-300`}>
            <span className={`font-bold`}>hi, i'm cedrik, </span>
            an {age.toString()} y/o student from belgium
          </div>

          <div className={"w-full max-w-[31.15rem] px-9"}>
            <Link
                href={"/about"}
                className={
                  "group my-3 inline-block w-full rounded border-2 border-gray-300/[0.3] bg-neutral-700/[.4] py-2 text-md leading-normal text-gray-200 shadow-lg transition duration-200 ease-in-out hover:bg-neutral-600/[.6] focus:bg-neutral-900/[.6] focus:outline-none focus:ring-0 active:bg-neutral-950"
                }
            >
              about me
              <TbArrowNarrowRight className={`ml-1 inline transition duration-1000 group-hover:translate-x-[.2rem]`} />
            </Link>
          </div>

          <SocialLinks />

        </main>
      </PageWrapper>
    </>
  );
}
