"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function GetPathname() {
    const pathname = usePathname();
    return (
        <span>{pathname}</span>
    );
}
