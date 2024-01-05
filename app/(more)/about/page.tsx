import React from "react";

import Image from "next/image";
import { age } from "@/app/components/Constants";

import fs from 'fs'
import path from 'path'
import { MDXRemote } from 'next-mdx-remote/rsc'
import {TbArrowNarrowLeft} from "react-icons/tb";

export const metadata = {
  title: "About",
};

export default function About() {

  const markdownFile = fs.readFileSync(path.join('content/about.mdx'), 'utf-8')

  return (
    // Navbar (delay with text)
    // Activity
    <>
      <div className={`prose prose-invert`}>

          <div className={`pb-4 text-lg`}>
              <a href="/" className={`no-underline`}>
                  <TbArrowNarrowLeft className={`mr-1 inline`} />
                  back to home
              </a>
          </div>

          <MDXRemote source={markdownFile} components={{Image}}/>
      </div>
    </>
  );
}