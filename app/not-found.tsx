import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-24">
      <h1 className="font-heading text-5xl">Not found</h1>
      <p className="mt-4 text-muted-foreground">
        That page is not part of the shipped World series.
      </p>
      <Link href="/" className="mt-8 text-primary hover:underline">
        Back to the world view
      </Link>
    </main>
  );
}
