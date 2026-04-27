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
  title: "xmarky - AI Agent",
  description: "xmarky is an AI chat agent powered by Nvidia NIM — Llama 4 Maverick. Experience next-gen conversational AI.",
  keywords: ["xmarky", "AI", "Nvidia", "NIM", "Llama", "Chat", "Agent"],
  authors: [{ name: "xmarky Team" }],
  icons: {
    icon: "/xmarky-logo.png",
  },
  openGraph: {
    title: "xmarky - AI Agent",
    description: "AI chat agent powered by Nvidia NIM — Llama 4 Maverick",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "xmarky - AI Agent",
    description: "AI chat agent powered by Nvidia NIM — Llama 4 Maverick",
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
