import type { Metadata } from "next";
import { Marcellus, Nunito, Amiri } from "next/font/google";
import "./globals.css";

const heading = Marcellus({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

const body = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const arabic = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "An-Nur Academy | UK-based Online Islamic Academy",
    template: "%s | An-Nur Academy",
  },
  description:
    "Qa'idah, Tajweed, Arabic, Hifz, Islamic Studies and Weekly Tafsir — taught online by qualified, first-language-English teachers based in the UK. Group and one-to-one classes for adults and children.",
  metadataBase: new URL("https://annur.online"),
  openGraph: {
    title: "An-Nur Academy",
    description: "UK-based online Islamic academy. Qualified English-speaking teachers.",
    url: "https://annur.online",
    siteName: "An-Nur Academy",
    locale: "en_GB",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} ${arabic.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
