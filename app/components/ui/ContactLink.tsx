import React, { ReactElement } from "react";
import Link from "next/link";
import { TbExternalLink } from "react-icons/tb";

export const ContactLink = ({name, icon, link}: {name: string; icon: ReactElement<any>; link: string}) => {
  const linkStr = typeof link === 'string' ? link : '';
  const isExternal = linkStr.startsWith("http");

    return (
    <Link
      className="flex flex-1 flex-row items-center space-x-2 rounded-sm border-2 border-gray-300/30 bg-neutral-700/40 p-4 text-md shadow-lg no-underline hover:bg-neutral-400/20 transition-colors"
      href={linkStr}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      <div className="text-3xl">{icon}</div>
      <div className="flex items-center gap-1">
        {name}
        {isExternal && (
          <small className="inline-flex text-gray-400">
            <TbExternalLink />
          </small>
        )}
      </div>
    </Link>
    );
}
