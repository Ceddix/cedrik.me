import React from "react";
import Image from "next/image";
import TypeWriter from '@/app/components/TypeWriter';
import SocialLinks from "@/app/components/SocialLinks";
import { Poppins } from "next/font/google";
import PageWrapper from "@/app/components/PageWrapper";
import { age } from "@/app/components/Constants"
import AboutButton from "@/app/components/AboutButton";

const poppins = Poppins({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-poppins"
})

export default function Home() {
    return (

        // Navbar (delay with text)
        // Activity

        <>

            <PageWrapper>

                <main className={"flex flex-col justify-center items-center text-center min-h-[70vh]"}>

                    <Image
                        src={`/profile.png`}
                        alt={`profile`}
                        className={`inline-block object-cover rounded-full border-[10px] border-[#21222b93] mb-2.5 cursor-pointer transition transform duration-500 hover:scale-105`}
                        quality={100}
                        width={170}
                        height={170}
                    />

                    <h1 className={`text-3xl font-bold pb-1`}>Cedrik Secic</h1>

                    <TypeWriter
                        text={`Hi, I'm Cedrik! I'm a ${age.toString()} y/o student from Belgium!`}
                        typeSpeed={80}
                        startDelay={500}
                        className={`text-[18px] text-[#94a1b2]`}
                    />

                    <AboutButton/>

                    <SocialLinks/>

                </main>

            </PageWrapper>

        </>
    )
}
