"use client";

import { useEffect, useState } from "react";

export function useTranslations(locale: string) {
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await import(`../locales/${locale}.json`);
      setDict(res.default);
    }
    load();
  }, [locale]);

  function t(path: string) {
    if (!dict) return "";

    return path.split(".").reduce((acc: any, part: string) => acc?.[part], dict);
  }

  return { t };
}
