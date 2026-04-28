import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "xmarky — AI Agent | LongCat-2.0-Preview",
  description: "xmarky is an AI agent powered by LongCat-2.0-Preview with 1M token context. Features skills library, multi-skill workflows, and MCP server integrations.",
  keywords: ["xmarky", "AI", "LongCat", "MCP", "Skills", "Workflows", "Chat", "Agent"],
  authors: [{ name: "xmarky Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "xmarky — AI Agent",
    description: "AI agent powered by LongCat-2.0-Preview with 1M context window",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "xmarky — AI Agent",
    description: "AI agent powered by LongCat-2.0-Preview with 1M context window",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
