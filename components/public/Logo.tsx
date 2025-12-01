"use client";

import Image from "next/image";
import WhiteLogo from "@/public/white_logo.png";
import GreenLogo from "@/public/green_logo.png";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Logo({
    isFooter = false,
    className = "",
}: {
    isFooter?: boolean;
    className?: string;
}) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className={`w-[120px] h-10 bg-surface-contrast rounded animate-pulse ${className}`} />
        );
    }

    const logoSrc = isFooter
        ? GreenLogo
        : theme === "dark"
            ? GreenLogo
            : WhiteLogo;

    return (
        <Image
            alt="logo"
            src={logoSrc}
            width={120}
            height={40}
            className={`object-contain ${className}`}
        />
    );
}
