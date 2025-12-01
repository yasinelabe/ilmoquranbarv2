"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function LanguageSwitcher({
  nextLang,
  href,
}: {
  nextLang: string;
  href: string;
}) {
  function handleClick() {
    document.cookie = `preferred-language=${nextLang}; path=/; max-age=31536000`;
  }

  return (
    <Link href={href}>
      <button
        onClick={handleClick}
        className="px-4 py-2 rounded-xl bg-brand-green text-white uppercase"
      >
        {nextLang}
      </button>
    </Link>
  );
}
