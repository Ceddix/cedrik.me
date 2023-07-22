"use client";

import React from 'react';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from "next/navigation";

const links = [
    {href: "/", label: "/"},
    {href: "/about", label: "About"},
    {href: "/blog", label: "Blog"},
    {href: "/contact", label: "Contact"}
];

export const NavBar = () => {

    const path = usePathname();

    return (
        <nav className={"flex flex-col relative items-center z-50 w-100"}>
            <div className={"block fixed top-4"}>
                <ul className={"flex flex-row w-auto py-1 px-3 rounded-xl bg-neutral-900/[.8] backdrop-blur-lg backdrop-saturate-150 shadow-md border border-white/[.125]"}>
                    {links.map((link) => (
                        <li key={link.href} className={"m-1"}>
                            <Link
                                  className={"group relative text-sm text-neutral-200 hover:text-[#576490] focus:outline-none focus:ring-0"}
                                  href={link.href}
                            >
                                {link.href === path && (
                                    <motion.span
                                        layoutId={"underline"}
                                        className={"absolute top-full block h-[1px] w-[94%] left-[3%] bg-neutral-200 group-hover:bg-[#576490]"}
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