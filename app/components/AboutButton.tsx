"use client";

import React from "react";
import Link from "next/link";

import { TbArrowNarrowRight } from 'react-icons/tb';

export default function AboutButton() {

  return (
    <div className={"w-full max-w-[31rem] px-9"}>
      <Link
        href={"/about"}
        className={
          "group my-3 inline-block w-full rounded border-2 border-gray-300/[0.8] bg-neutral-700/[.4] py-2 text-md leading-normal text-gray-200 shadow-lg transition duration-200 ease-in-out hover:bg-neutral-600/[.6] focus:bg-neutral-900/[.6] focus:outline-none focus:ring-0 active:bg-neutral-950"
        }
      >
        about me
        <TbArrowNarrowRight className={`ml-1 inline transition duration-1000 group-hover:translate-x-[.2rem]`} />
      </Link>
    </div>
  );
}
