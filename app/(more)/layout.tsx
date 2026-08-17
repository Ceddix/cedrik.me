import type { ReactNode } from "react";

import { NavBar } from "@/app/components/ui/NavBar";
import PageWrapper from "@/app/components/PageWrapper";

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
      <>

          <div className={`flex flex-col h-screen overflow-y-auto items-center`}>

              {/*<NavBar/>*/}

              <main className={`p-5 py-20`}>

                  <PageWrapper>

                      {children}

                  </PageWrapper>

              </main>

          </div>

      </>
  )
}
