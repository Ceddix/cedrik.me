"use client";

import React, {useEffect} from 'react';
import {stagger, useAnimate} from 'framer-motion';
import Link from "next/link";

export default function AboutButton() {

    const [scope, animate] = useAnimate()

    useEffect(() => {

        animate("a", {
            opacity: [0, 1], y: [.5, 0], pointerEvents: ["none", "auto"]
        }, {
            delay: 6.5
        })

    })

    return (
        <div className={"w-full max-w-lg px-9"} ref={scope}>
            <Link
                href={"/about"}
                className={"inline-block group rounded w-full bg-neutral-800/[.4] border border-gray-300/[0.1] mt-2 mb-1 pb-2 pt-2.5 text-sm leading-normal text-neutral-50 shadow-lg transition duration-200 ease-in-out hover:bg-neutral-900/[.6] focus:bg-neutral-900/[.6] focus:outline-none focus:ring-0 active:bg-neutral-950"}>
                more
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="inline ml-1 transition duration-1000 group-hover:translate-x-[.2rem]" viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
            </Link>
        </div>
    )

}