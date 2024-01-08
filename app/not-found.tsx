import React from "react";

import Link from 'next/link';
import { TbArrowNarrowLeft } from "react-icons/tb";
import PageWrapper from "@/app/components/PageWrapper";
import GetPathname from "@/app/components/GetPathname";


export const metadata = {
    title: "404",
};

export default function NotFound() {
    return (
        <>
            <div className={`flex flex-col h-screen overflow-y-auto items-center`}>
                <main className={`p-5 py-20`}>
                    <PageWrapper>
                        <div className={`prose prose-invert`}>

                            <h1 className={`mb-0`}>404 — Not Found</h1>
                            <p className={`mt-2 text-lg`}>The page you are looking for (<code><GetPathname/></code>) could not be found.
                                <br/>Perhaps you have mistyped, or the URL you entered no longer exists.</p>

                            <div className={`pb-4 text-lg`}>
                                <Link href="/" className={`no-underline`}>
                                    <TbArrowNarrowLeft className={`mr-1 inline`} />
                                    back to home
                                </Link>
                            </div>

                        </div>
                    </PageWrapper>
                </main>
            </div>
        </>
    );
}