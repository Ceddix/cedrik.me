"use client";

import React, { useEffect } from 'react';
import { useAnimate, stagger } from 'framer-motion';

// initial="hidden"
// whileInView="visible"
// viewport={{ once: true }}
// transition={{ duration: 0.3, delay: 7.8 }}
// variants={{
//     visible: { opacity: 1, y: 0 },
//     hidden: { opacity: 0, y: -10 }
// }}

export default function SocialLinks() {
    const [scope, animate] = useAnimate()

    useEffect(() => {

        animate("li", {
            opacity: [0, 1], y: [5, 0]
        }, {
            delay: stagger(0.2, { startDelay: 6 })
        })

    })

    return (
        <ul ref={scope} className={`flex flex-row pt-2 text-2xl text-[#a6a8b8] [&_li]:mx-1.5 [&_li]:my-1 [&_li]:p-1 [&_li:hover]:text-white text`}>
            <li>
                <a target="_blank" href="https://github.com/Ceddix">
                    <i className={`fab fa-github`}></i>
                </a>
            </li>

            <li>
                <a target="_blank" href="https://open.spotify.com/user/2fy35e57mzi84b2zhafnu7t5r?si=b11fa648285e413f">
                    <i className={`fab fa-spotify`}></i>
                </a>
            </li>

            <li>
                <a target="_blank" href="https://instagram.com/cedrik.sc_">
                    <i className={`fab fa-instagram`}></i>
                </a>
            </li>

            <li>
                <a target="_blank" href="https://discord.gg/DXuKCRz">
                    <i className={`fab fa-discord`}></i>
                </a>
            </li>

            <li>
                <a target="_blank" href="https://mastodon.social/@cedrik_sc" rel="me">
                    <i className={`fa-brands fa-mastodon`}></i>
                </a>
            </li>

            <li>
                <a target="_blank" href="https://twitter.com/CeddixCed">
                    <i className={`fab fa-twitter`}></i>
                </a>
            </li>
        </ul>
    )

}