import { NavBar } from "@/app/components/NavBar";
import React from "react";
export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
      <>

          <div className={"flex flex-col h-screen overflow-y-auto items-center"}>

              <NavBar/>

              <main className={"flex-1 p-5 py-20 max-w-4xl w-full"}>

                  <div className={"relative overflow-y-hidden"}>

                      {children}

                  </div>

              </main>

          </div>

      </>
  )
}
