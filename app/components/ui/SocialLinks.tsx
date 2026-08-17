"use client";

import React, { useEffect } from "react";

import { useAnimate, stagger } from "framer-motion";

import { TbBrandGithub, TbBrandSpotify, TbBrandInstagram, TbBrandThreads, TbBrandDiscord } from 'react-icons/tb';
import { SITE_CONFIG } from "@/app/lib/config";

export default function SocialLinks() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      "li",
      {
        opacity: [0, 1],
        y: [5, 0],
        pointerEvents: ["none", "auto"],
      },
      {
        delay: stagger(0.2, { startDelay: 0.5 }),
      },
    );
  });

  return (
    <ul
      ref={scope}
      className={`flex flex-row text-gray-300 [&_a]:focus:text-white [&_a]:focus:outline-hidden [&_a]:focus:ring-0 [&_li]:mx-1 [&_li]:my-0.5 [&_li]:p-1 [&_li]:drop-shadow-md [&_li]:hover:text-white transition-all duration-200`}
    >

      <li>
        <a target="_blank" href={SITE_CONFIG.socials.github} rel="noreferrer">
          <TbBrandGithub size={32} />
        </a>
      </li>

      <li>
        <a
          target="_blank"
          href={SITE_CONFIG.socials.spotify}
          rel="noreferrer"
        >
          <TbBrandSpotify size={32} />
        </a>
      </li>

      <li>
        <a target="_blank" href={SITE_CONFIG.socials.instagram} rel="noreferrer">
          <TbBrandInstagram size={32} />
        </a>
      </li>

      <li>
        <a target="_blank" href={SITE_CONFIG.socials.threads} rel="noreferrer">
          <TbBrandThreads size={32} />
        </a>
      </li>

      <li>
        <a target="_blank" href={SITE_CONFIG.socials.discord} rel="noreferrer">
          <TbBrandDiscord size={32} />
        </a>
      </li>

    </ul>
  );
}
