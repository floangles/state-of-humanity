"use client";

import { useLocale } from "@/components/locale-provider";
import { Slider } from "@/components/ui/slider";

type YearScrubberProps = {
  year: number;
  minYear: number;
  maxYear: number;
  onYearChange: (year: number) => void;
};

export function YearScrubber({
  year,
  minYear,
  maxYear,
  onYearChange,
}: YearScrubberProps) {
  const { t } = useLocale();

  return (
    <section className="sticky top-16 z-30 border-y border-border/70 bg-background/85 py-5 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
              {t.scrubberLabel}
            </p>
            <p className="font-heading text-3xl">{year}</p>
          </div>
          <p className="max-w-sm text-right text-sm text-muted-foreground">
            {t.scrubberHint}
          </p>
        </div>
        <Slider
          min={minYear}
          max={maxYear}
          step={1}
          value={[year]}
          onValueChange={(value) => {
            const next = Array.isArray(value) ? value[0] : value;
            if (typeof next === "number") {
              onYearChange(next);
            }
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{minYear}</span>
          <span>{maxYear}</span>
        </div>
      </div>
    </section>
  );
}
