import type { Metadata } from "next";
import { Barlow, Geist_Mono } from "next/font/google";

import { LocaleProvider } from "@/components/locale-provider";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "State of Humanity",
    template: "%s · State of Humanity",
  },
  description:
    "Official world series on survival, literacy, living standards, conflict, and the planet. No homemade averages.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${barlow.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <LocaleProvider>
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
        </LocaleProvider>
      </body>
    </html>
  );
}
