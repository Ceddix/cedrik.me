"use client";

import React, { useEffect } from "react";

import { useAnimate, stagger } from "framer-motion";

import { TbBrandGithub, TbBrandSpotify, TbBrandInstagram, TbBrandThreads, TbBrandDiscord, TbBrandLinkedin } from 'react-icons/tb';
import { SITE_CONFIG } from "@/app/lib/config";

export default function SocialLinks() {
  const [scope, animate] = useAnimate();
  
  const links = [
    { name: "GitHub", url: SITE_CONFIG.socials.github, icon: TbBrandGithub },
    { name: "Spotify", url: SITE_CONFIG.socials.spotify, icon: TbBrandSpotify },
    { name: "Instagram", url: SITE_CONFIG.socials.instagram, icon: TbBrandInstagram },
    { name: "Threads", url: SITE_CONFIG.socials.threads, icon: TbBrandThreads },
    { name: "Discord", url: SITE_CONFIG.socials.discord, icon: TbBrandDiscord },
    { name: "LinkedIn", url: SITE_CONFIG.socials.linkedin, icon: TbBrandLinkedin },
  ];

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
      {links.map((link) => (
        <li key={link.name}>
          <a target="_blank" href={link.url} rel="noreferrer">
            <link.icon size={32} />
          </a>
        </li>
      ))}
    </ul>
  );
}
