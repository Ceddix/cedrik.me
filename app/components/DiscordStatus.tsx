"use client";

import React from 'react';

import { useLanyardWS } from "use-lanyard";
import { discordId } from "@/app/components/Constants";
import { motion } from 'framer-motion';
import clsx from "clsx";

export default function DiscordStatus() {

    const socket = useLanyardWS(discordId);
    const status = socket?.discord_status || "loading"

    return (
        <span
            className={clsx(
            "bottom-2 right-6 absolute w-6 h-6 border-4 border-zinc-800 rounded-full transition duration-300",
            {
                ['bg-green-400']: status === "online",
                ['bg-orange-400']: status === "idle",
                ['bg-red-500']: status === "dnd",
                ['bg-zinc-800 opacity-0']: status === "offline" || status === "loading",
            },
        )}/>
    )
}