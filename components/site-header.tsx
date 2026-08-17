"use client";

import Link from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useLocale } from "@/components/locale-provider";

export function SiteHeader() {
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-medium tracking-[0.18em] uppercase"
        >
          {t.brand}
        </Link>
        <nav className="flex items-center gap-6 text-xs tracking-[0.16em] text-muted-foreground uppercase">
          <Link href="/" className="transition-colors hover:text-foreground">
            {t.navWorld}
          </Link>
          <Link
            href="/sources"
            className="transition-colors hover:text-foreground"
          >
            {t.navSources}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
