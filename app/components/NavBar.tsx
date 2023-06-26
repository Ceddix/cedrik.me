"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {usePathname} from "next/navigation";
import Image from "next/image";

const links = [
    {href: "/about", label: "About"},
    {href: "/blog", label: "Blog"},
    {href: "/contact", label: "Contact"}
];

export const NavBar = () => {

    const path = usePathname();

    return (
        <nav className={"flex flex-col items-center z-10 w-100"}>
            <div className={"block fixed top-4"}>
                <ul className={"flex flex-row w-auto py-1 px-3 rounded-xl bg-neutral-900/[.8] backdrop-blur-lg backdrop-saturate-150 shadow-md border border-white/[.125]"}>
                    <div className={"m-1 h-5 w-5 rounded-full"}>
                        <Link
                            href={"/"}
                        >
                            <Image
                                src={`/profile.png`}
                                alt={`profile`}
                                className={`inline-block object-cover rounded-full`}
                                quality={100}
                                width={100}
                                height={100}
                            />
                        </Link>
                    </div>
                    {links.map((link) => (
                        <li key={link.href} className={"m-1"}>
                            <Link
                                  className={"group relative text-sm text-neutral-200 hover:text-[#8a8483] focus:outline-none focus:ring-0"}
                                  href={link.href}
                                /*className={"inline-block rounded-2xl py-2 px-3 bg-gray-700 bg-opacity-50 text-gray-200 shadow-md transition transform duration-250 hover:bg-opacity-100 hover:scale-105"}*/
                            >
                                {link.href === path && (
                                    <motion.span
                                        layoutId={"underline"}
                                        className={"absolute top-full block h-[.8px] w-[96%] left-[2%] bg-neutral-200 group-hover:bg-[#8a8483]"}
                                    />
                                )}
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}