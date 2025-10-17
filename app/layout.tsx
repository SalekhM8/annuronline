import type { Metadata } from "next";
import { Fredoka, Nunito, Amiri } from "next/font/google";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";

const fredoka = Fredoka({ 
  variable: "--font-playful", 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

const nunito = Nunito({ 
  variable: "--font-body", 
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"]
});

const amiri = Amiri({ 
  variable: "--font-arabic", 
  subsets: ["arabic", "latin"],
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: "An‑Nur Academy | UK‑based Online Islamic Academy",
  description: "Qaidah, Quran, Hifz, Tajweed, Islamic Studies, Naseeha, Counselling, Arabic. Free assessment. Segregated classes. Group & 1:1. UK based, worldwide access.",
  metadataBase: new URL("https://annur.online"),
  openGraph: {
    title: "An‑Nur Academy",
    description: "UK‑based online Islamic academy. Qualified English-speaking teachers.",
    url: "https://annur.online",
    siteName: "An‑Nur Academy",
    images: [{ url: "/annurlogo.JPG", width: 1200, height: 630 }],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "An‑Nur Academy",
    description: "UK‑based online Islamic academy",
    images: ["/annurlogo.JPG"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${nunito.variable} ${amiri.variable} antialiased`}>
        <Header />
        <main className="container-px mx-auto">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
