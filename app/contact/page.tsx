import React from "react";
import { Poppins } from "next/font/google";
import { PageWrapper } from "@/app/components/PageWrapper";

const poppins = Poppins({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-poppins"
})

export default function About() {
  return (

      // Navbar (delay with text)
      // Activity

      <>

          <PageWrapper>

              Contact

          </PageWrapper>

      </>
  )
}
