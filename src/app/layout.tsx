import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthCodeRedirect from "@/components/AuthCodeRedirect";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vasteams.com"),
  title: {
    default: "VAST — Questions Is All We've Got",
    template: "%s — Vas Bakopoulos",
  },
  description:
    "When answers are free, questions are the only advantage left. AI research, interactive data stories, and experiments by Vas Bakopoulos.",
  openGraph: {
    type: "website",
    siteName: "VAST",
    title: "VAST — Questions Is All We've Got",
    description:
      "When answers are free, questions are the only advantage left. AI research, interactive data stories, and experiments by Vas Bakopoulos.",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://vasteams.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistMono.variable} antialiased bg-black`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MKVDNBTXFW"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MKVDNBTXFW');
          `}
        </Script>
        <AuthCodeRedirect />
        {children}
      </body>
    </html>
  );
}
