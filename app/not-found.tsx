"use client";

import Link from "next/link";

import { useLocale } from "@/components/locale-provider";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-24">
      <h1 className="font-heading text-5xl">{t.notFound.title}</h1>
      <p className="mt-4 text-muted-foreground">{t.notFound.body}</p>
      <Link href="/" className="mt-8 text-primary hover:underline">
        {t.notFound.back}
      </Link>
    </main>
  );
}
