import Image from "next/image";

import fs from 'fs'
import path from 'path'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { TbArrowNarrowLeft, TbBrandDiscord, TbBrandInstagram, TbMail } from "react-icons/tb";
import CustomLink from "@/app/components/ui/CustomLink";
import ContactForm from "@/app/components/ui/ContactForm";
import { ContactLink } from "@/app/components/ui/ContactLink";

import { getAge } from "@/app/lib/age";

export const metadata = {
    title: "About",
};

export default async function About() {
    const userAge = await getAge();
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

                <MDXRemote source={markdownFile} components={{ Age: () => <>{userAge}</>, Image, ContactForm, ContactLink, TbBrandDiscord, TbBrandInstagram, TbMail, a: CustomLink }} />

            </div>
        </>
    );
}