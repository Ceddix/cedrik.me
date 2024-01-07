"use client";

import React from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "/" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const NavBar = () => {
  const path = usePathname();

  return (
    <nav className={"w-100 relative z-50 flex flex-col items-center"}>
      <div className={"fixed top-4 block"}>
        <ul
          className={
            "flex w-auto flex-row rounded-xl border border-white/[.125] bg-neutral-900/[.8] px-3 py-1 shadow-md backdrop-blur-lg backdrop-saturate-150"
          }
        >
          {links.map((link) => (
            <li key={link.href} className={"m-1"}>
              <Link
                className={
                  "group relative text-sm text-neutral-200 hover:text-[#576490] focus:outline-none focus:ring-0"
                }
                href={link.href}
              >
                {link.href === path && (
                  <motion.span
                    layoutId={"underline"}
                    className={
                      "absolute left-[3%] top-full block h-[1px] w-[94%] bg-neutral-200 group-hover:bg-[#576490]"
                    }
                  />
                )}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
