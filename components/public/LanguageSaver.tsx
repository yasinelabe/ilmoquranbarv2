"use client";

import { useEffect } from "react";

export default function LanguageSaver({ locale }: { locale: string }) {
    useEffect(() => {
        if (locale) {
            localStorage.setItem("preferred-language", locale);
        }
    }, [locale]);

    return null;
}
