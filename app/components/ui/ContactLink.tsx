import React, { ReactElement } from "react";
import Link from "next/link";

export const ContactLink = ({name, icon, link}: {name: string; icon: ReactElement<any>; link: string}) => {

    return (
            <Link
                className={`flex flex-row flex-1 rounded-sm border-2 border-gray-300/30 bg-neutral-700/40 p-4 text-md shadow-lg no-underline space-x-2 items-center hover:bg-neutral-400/20`}
                href={link} target={"_blank"}>
                <div className={`text-3xl`}>{icon}</div>
                <div>{name}</div>
            </Link>
    );
}
