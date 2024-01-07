import Link from 'next/link';
import {TbArrowNarrowLeft} from "react-icons/tb";
import React from "react";
import PageWrapper from "@/app/components/PageWrapper";

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

                            <h1 className={`leading-3 mb-0`}>Error: 404</h1>
                            <p>It appears that the page you're looking for couldn't be found...</p>

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