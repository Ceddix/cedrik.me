import React, { ReactElement } from "react";
import Link from "next/link";
import {TbExternalLink} from "react-icons/tb";

export const ContactLink = ({name, icon, link}: {name: string; icon: ReactElement; link: string}) => {

    return (
            <Link
                className={`flex flex-row rounded border-2 border-gray-300/[0.3] bg-neutral-700/[.4] p-4 text-md shadow-lg no-underline space-x-2 items-center`}
                href={link}>
                <div className={`text-3xl`}>{icon}</div>
                <div>{name} <small className={`inline-flex`}><TbExternalLink /></small></div>
            </Link>
    );
}
