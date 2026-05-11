import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/src/components/ui/Navbar";
import RobotChatbot from "@/src/components/ui/RobotChatbot";
import ScrollToTop from "@/src/components/utils/ScrollToTop";
import MotionProvider from "@/src/components/utils/MotionProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://samet-karadag.dev"),
  title: "Samet Karadağ | Backend Developer",
  description: "Bridging Backend Logic with Creative Frontend Vision.",
  keywords: [
    "Samet Karadağ", "Backend Developer", "Full-Stack Engineer",
    ".NET 9", "Clean Architecture", "React 19", "Next.js", "TypeScript",
    "Portfolio", "Istanbul",
  ],
  authors: [{ name: "Samet Karadağ", url: "https://github.com/Sametkrdg" }],
  openGraph: {
    title: "Samet Karadağ | Backend Developer",
    description: "Bridging Backend Logic with Creative Frontend Vision.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Samet Karadağ | Backend Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Samet Karadağ | Backend Developer",
    description: "Bridging Backend Logic with Creative Frontend Vision.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-16">
        <ScrollToTop />
        <MotionProvider>
          <Navbar />
          {children}
          <RobotChatbot />
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
