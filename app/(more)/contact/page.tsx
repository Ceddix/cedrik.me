import React from "react";
import { Poppins } from "next/font/google";
import PageWrapper from "@/app/components/PageWrapper";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poppins",
});

export const metadata = {
  title: "Contact",
};

export default function About() {
  return (
    // Navbar (delay with text)
    // Activity

    <>
      <PageWrapper>
        Contact
        <br />
        <Link href="/">Back</Link>
      </PageWrapper>
    </>
  );
}
