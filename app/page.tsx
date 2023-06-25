import React from "react";
import Image from "next/image";
import TypeWriter from '@/app/components/TypeWriter';
import SocialLinks from "@/app/components/SocialLinks";
import { Poppins } from "next/font/google";
import { PageWrapper } from "@/app/components/PageWrapper";
import { age } from "@/app/components/Constants"

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

                    <a
                        href={"/about"}
                        className="inline-block group rounded max-w-sm w-96 min-w-0 bg-neutral-800/[.4] border border-gray-300/[0.1] mt-2 mb-1 mx-8 px-6 pb-2 pt-2.5 text-sm leading-normal text-neutral-50 shadow-lg transition duration-200 ease-in-out hover:bg-neutral-900/[.6] focus:bg-neutral-900/[.6] focus:outline-none focus:ring-0 active:bg-neutral-950">
                        more
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="inline ml-1 transition duration-1000 group-hover:translate-x-[.2rem]" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                        </svg>
                        {/*<i className="fa-solid fa-arrow-right ml-0.5 transition duration-1000 group-hover:translate-x-0.5"></i>*/}
                    </a>

                    <SocialLinks/>

                </main>

            </PageWrapper>

        </>
    )
}
