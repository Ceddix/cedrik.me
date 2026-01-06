import React from "react";

import Image from "next/image";
import { age } from "@/app/components/Constants";

import fs from 'fs'
import path from 'path'
import { MDXRemote } from 'next-mdx-remote/rsc'
import {TbArrowNarrowLeft, TbBrandDiscord, TbBrandInstagram, TbMail, TbCompass, TbMap} from "react-icons/tb";
import CustomLink from "@/app/components/ui/CustomLink";
import ContactForm from "@/app/components/ui/ContactForm";
import {ContactLink} from "@/app/components/ui/ContactLink";

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
                        <TbArrowNarrowLeft className={`mr-1 inline`}/>
                        back to home
                    </a>
                </div>

                <MDXRemote source={markdownFile} components={{Image, ContactForm, ContactLink, TbBrandDiscord, TbBrandInstagram, TbMail, TbCompass, TbMap, a: CustomLink}}/>

            </div>
        </>
    );
}