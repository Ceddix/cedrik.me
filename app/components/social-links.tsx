"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const SocialLinks = () => (
    <ul className={`flex flex-row pt-2 text-2xl text-[#a6a8b8] [&_li]:mx-1.5 [&_li]:my-1 [&_li]:p-1 [&_li:hover]:text-white text`}>
        <motion.li
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 6.2 }}
            exit={{ opacity: 0, y: 5 }}
        >
            <a target="_blank" href="https://github.com/Ceddix">
                <i className={`fab fa-github`}></i>
            </a>
        </motion.li>

        <motion.li
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 6.4 }}
            exit={{ opacity: 0, y: 5 }}
        >
            <a target="_blank" href="https://open.spotify.com/user/2fy35e57mzi84b2zhafnu7t5r?si=b11fa648285e413f">
                <i className={`fab fa-spotify`}></i>
            </a>
        </motion.li>

        <motion.li
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 6.6 }}
            exit={{ opacity: 0, y: 5 }}
        >
            <a target="_blank" href="https://instagram.com/cedrik.sc_">
                <i className={`fab fa-instagram`}></i>
            </a>
        </motion.li>

        <motion.li
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 6.8 }}
            exit={{ opacity: 0, y: 5 }}
        >
            <a target="_blank" href="https://discord.gg/DXuKCRz">
                <i className={`fab fa-discord`}></i>
            </a>
        </motion.li>

        <motion.li
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 7 }}
            exit={{ opacity: 0, y: 5 }}
        >
            <a target="_blank" href="https://mastodon.social/@cedrik_sc" rel="me">
                <i className={`fa-brands fa-mastodon`}></i>
            </a>
        </motion.li>

        <motion.li
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 7.2 }}
            exit={{ opacity: 0, y: 5 }}
        >
            <a target="_blank" href="https://twitter.com/CeddixCed">
                <i className={`fab fa-twitter`}></i>
            </a>
        </motion.li>
    </ul>
)