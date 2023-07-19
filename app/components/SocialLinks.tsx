"use client";

import React, { useEffect } from 'react';

import { useAnimate, stagger } from 'framer-motion';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faSpotify, faInstagram, faDiscord, faMastodon, faTwitter } from "@fortawesome/free-brands-svg-icons";

export default function SocialLinks() {

    const [scope, animate] = useAnimate()

    useEffect(() => {

        animate("li", {
            opacity: [0, 1], y: [5, 0], pointerEvents: ["none", "auto"]
        }, {
            delay: stagger(0.2, { startDelay: 6.5 })
        })

    })

    return (
        <ul ref={scope}
            className={`flex flex-row text-2xl text-gray-400 [&_li]:mx-1.5 [&_li]:my-1 [&_li]:p-1 [&_li]:drop-shadow-md hover:[&_li]:text-white focus:[&_a]:outline-none focus:[&_a]:ring-0 focus:[&_a]:text-white`}>
            <li>
                <a target="_blank"
                   href="https://github.com/Ceddix">
                    <FontAwesomeIcon icon={faGithub} />
                </a>
            </li>

            <li>
                <a target="_blank"
                   href="https://open.spotify.com/user/2fy35e57mzi84b2zhafnu7t5r?si=b11fa648285e413f">
                    <FontAwesomeIcon icon={faSpotify} />
                </a>
            </li>

            <li>
                <a target="_blank"
                   href="https://instagram.com/cedrik.sc_">
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
            </li>

            <li>
                <a target="_blank"
                   href="https://discord.com/users/463620307245072384">
                    <FontAwesomeIcon icon={faDiscord} />
                </a>
            </li>

            <li>
                <a target="_blank"
                   href="https://mastodon.social/@cedrik_sc" rel="me">
                    <FontAwesomeIcon icon={faMastodon} />
                </a>
            </li>

            <li>
                <a target="_blank"
                   href="https://twitter.com/cedrik_sc">
                    <FontAwesomeIcon icon={faTwitter} />
                </a>
            </li>
        </ul>
    )

}