"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const PageWrapper = ({
    children,
}: {
    children: React.ReactNode;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: .8 } }}
        exit={{ opacity: 0, y: 20 }}
    >
        {children}
    </motion.div>
)