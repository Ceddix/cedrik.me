"use client";

import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {usePathname} from "next/navigation";

export default function PageWrapper({ children }: { children: React.ReactNode; }) {
    const pathname = usePathname();
    return (
        <AnimatePresence mode={"wait"}>
            <motion.div key={pathname}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0, transition: {duration: .8}}}
                exit={{opacity: 0, y: 20}}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}