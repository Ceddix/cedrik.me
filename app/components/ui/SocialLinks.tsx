"use client";

import React, { useEffect } from "react";

import { useAnimate, stagger } from "framer-motion";

import { TbBrandGithub, TbBrandSpotify, TbBrandInstagram, TbBrandThreads, TbBrandDiscord } from 'react-icons/tb';

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
      className={`flex flex-row text-gray-300 [&_a]:focus:text-white [&_a]:focus:outline-hidden [&_a]:focus:ring-0 [&_li]:mx-1.5 [&_li]:my-1 [&_li]:p-1 [&_li]:drop-shadow-md [&_li]:hover:text-white transition-all duration-200`}
    >
      <li>
        <a target="_blank" href="https://github.com/Ceddix">
          <TbBrandGithub size={32}/>
        </a>
      </li>

      <li>
        <a
          target="_blank"
          href="https://open.spotify.com/user/2fy35e57mzi84b2zhafnu7t5r?si=b11fa648285e413f"
        >
          <TbBrandSpotify size={32}/>
        </a>
      </li>

      <li>
        <a target="_blank" href="https://instagram.com/cedrik.sc_">
          <TbBrandInstagram size={32}/>
        </a>
      </li>

      <li>
        <a target="_blank" href="https://threads.net/@cedrik.sc_">
          <TbBrandThreads size={32}/>
        </a>
      </li>

      <li>
        <a target="_blank" href="https://discord.com/users/463620307245072384">
          <TbBrandDiscord size={32}/>
        </a>
      </li>

      {/*<li>*/}
      {/*  <a target="_blank" href="https://mastodon.social/@cedrik_sc" rel="me">*/}
      {/*    <FontAwesomeIcon icon={faMastodon} />*/}
      {/*  </a>*/}
      {/*</li>*/}

      {/*<li>*/}
      {/*  <a target="_blank" href="https://twitter.com/cedrik_sc">*/}
      {/*    <FontAwesomeIcon icon={faXTwitter} />*/}
      {/*  </a>*/}
      {/*</li>*/}
    </ul>
  );
}
