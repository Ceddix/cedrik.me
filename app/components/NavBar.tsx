"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from "next/navigation";
import { useKeyPress } from "ahooks";

const links = [
    {href: "/", label: "Home"},
    {href: "/about", label: "About Me"},
    {href: "/contact", label: "Contact"}
];

export const NavBar = () => {

    return (
        <motion.nav
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 7.8 }}
            variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: -10 }
            }}
        >
            <ul className={"flex flex-row justify-center"}>
                {links.map((link) => (
                    <li key={link.href} className={"mt-6 mx-1.5"}>
                        <Link href={link.href}
                              className={"inline-block rounded-2xl py-2 px-3 bg-gray-700 bg-opacity-50 text-gray-200 shadow-md transition transform duration-250 hover:bg-opacity-100 hover:scale-105"}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </motion.nav>
    )
}