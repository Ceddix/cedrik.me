import { NavBar } from "@/app/components/NavBar";
import React from "react";
export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
      <>

          <NavBar/>

          <div className={"flex relative items-stretch flex-grow overflow-y-auto"}>

              <main className={"flex flex-col relative max-w-3xl mx-auto w-full h-screen"}>

                  <div className={"block flex-grow text-justify p-5 pt-20 pb-36"}>

                      {children}

                  </div>

              </main>

          </div>

      </>
  )
}
