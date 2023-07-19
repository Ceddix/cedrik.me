import { NavBar } from "@/app/components/NavBar";
import React from "react";
export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
      <>

          <div className={"flex flex-col h-screen overflow-y-auto items-left"}>

              <NavBar/>

              <main className={"flex-1 p-5 pt-20 pb-36 max-w-3xl"}>

                  <div className={"relative w-full overflow-y-hidden text-justify"}>

                      {children}

                  </div>

              </main>

          </div>

      </>
  )
}
