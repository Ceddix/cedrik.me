import { NavBar } from "@/app/components/NavBar";
import React from "react";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />

      <div className={"relative flex flex-grow items-stretch overflow-y-auto"}>
        <main
          className={"relative mx-auto flex h-screen w-full max-w-3xl flex-col"}
        >
          <div className={"block flex-grow p-5 pb-36 pt-20 text-justify"}>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
