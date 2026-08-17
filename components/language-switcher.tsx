"use client";

import { useLocale } from "@/components/locale-provider";
import { LOCALE_LABELS, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function FlagGB({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="4.5" />
      <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="13" />
      <path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="7" />
    </svg>
  );
}

function FlagFR({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      <rect width="20" height="40" fill="#002654" />
      <rect x="20" width="20" height="40" fill="#fff" />
      <rect x="40" width="20" height="40" fill="#ED2939" />
    </svg>
  );
}

const FLAGS: Record<Locale, typeof FlagGB> = {
  en: FlagGB,
  fr: FlagFR,
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language">
      {(["en", "fr"] as const).map((code) => {
        const Flag = FLAGS[code];
        const selected = locale === code;

        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={selected}
            aria-label={LOCALE_LABELS[code]}
            title={LOCALE_LABELS[code]}
            className={cn(
              "rounded-sm p-0.5 transition-opacity",
              selected
                ? "opacity-100 ring-1 ring-white/80"
                : "opacity-45 hover:opacity-80",
            )}
          >
            <Flag className="h-4 w-6 overflow-hidden rounded-[2px]" />
          </button>
        );
      })}
    </div>
  );
}
