import React from "react";
import { Poppins } from "next/font/google";
import { PageWrapper } from "@/app/components/PageWrapper";

const poppins = Poppins({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-poppins"
})

export const metadata = {
    title: 'About',
}

export default function About() {
  return (

      // Navbar (delay with text)
      // Activity

      <>

          <PageWrapper>

              About Me
              <br/>
              <a href="/">Back</a>

          </PageWrapper>

      </>
  )
}
