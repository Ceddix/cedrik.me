"use client";

import React, { useEffect } from "react";

import { useAnimate, stagger } from "framer-motion";

import { TbBrandGithub, TbBrandSpotify, TbBrandInstagram, TbBrandThreads, TbBrandDiscord, TbBrandLinkedin } from 'react-icons/tb';

export default function SocialLinks() {
  const [scope, animate] = useAnimate();
  const links = [
      { name: "GitHub", url: "https://github.com/Ceddix", icon: TbBrandGithub },
      { name: "Spotify", url: "https://open.spotify.com/user/2fy35e57mzi84b2zhafnu7t5r?si=b11fa648285e413f", icon: TbBrandSpotify },
      { name: "Instagram", url: "https://instagram.com/cedrik.sc_", icon: TbBrandInstagram },
      { name: "Threads", url: "https://threads.net/@cedrik.sc_", icon: TbBrandThreads },
      { name: "Discord", url: "https://discord.com/users/463620307245072384", icon: TbBrandDiscord },
      { name: "LinkedIn", url: "https://www.linkedin.com/in/cedrik-secic/", icon: TbBrandLinkedin },
      //{ name: "Mastodon", url: "https://mastodon.social/@cedrik_sc", icon: TbBrandMastodon },
      //{ name: "Twitter", url: "https://twitter.com/cedrik_sc", icon: TbBrandXTwitter },
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

        {links.map((link, index) =>
            <li key={index}>
                <a target={"_blank"} href={link.url}>
                    <link.icon size={32}/>
                </a>
            </li>
        )}

    </ul>
  );
}
