import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { site } from "@/content/site";
import "./globals.css";

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pragashux.github.io"),
  icons: { icon: "/favicon.svg" },
  title: {
    default: site.seoTitle,
    template: `%s — ${site.name}`,
  },
  description: site.seoDescription,
  openGraph: {
    title: site.seoTitle,
    description: site.seoDescription,
    type: "website",
    images: [{ url: site.portrait, alt: "Portrait of Pragash Santhakumar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seoTitle,
    description: site.seoDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Cursor />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
