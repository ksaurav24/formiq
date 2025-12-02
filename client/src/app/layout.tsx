import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes'
import { Toaster } from "@/components/ui/sonner"
import { RootProvider } from 'fumadocs-ui/provider/next';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://formiq.devxsaurav.in"),
  title: "Formiq - Collect, Manage & Track Form Submissions Without a Backend",
  description:
    "Formiq lets frontend developers seamlessly collect, manage, and track form submissions from static sites and portfolios - with API keys, analytics, and zero setup.",
  keywords: [
    "form backend",
    "form API",
    "frontend forms",
    "contact form backend",
    "portfolio form submissions",
    "static site forms",
    "form submission service",
    "developer tools",
    "formiq",
  ],
  authors: [{ name: "Saurav Kale", url: "https://formiq.devxsaurav.in" }],
  openGraph: {
    title: "Formiq - Backend for Your Frontend Forms",
    description:
      "No backend? No problem. Formiq helps you collect and manage form submissions directly from your frontend websites. Perfect for portfolios, static sites, and MVPs.",
    url: "https://formiq.devxsaurav.in",
    siteName: "Formiq",
    images: [
      {
        url: "https://formiq.devxsaurav.in/og-image.png",  
        width: 1200,
        height: 732,
        alt: "Formiq - Backend for Your Frontend Forms",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Formiq - Backend for Your Frontend Forms",
    description:
      "Collect, manage, and track form submissions from your frontend projects instantly. No servers, no setup.",
    images: ["https://formiq.devxsaurav.in/og-image.png"],   
  },
  themeColor: "#2563eb",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootProvider>{children}</RootProvider>
        <Toaster richColors position="top-right" closeButton duration={3000} />
      </body>
      </ThemeProvider>
    </html>
  );
}
