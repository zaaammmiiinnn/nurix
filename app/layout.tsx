import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  display: "swap",
  weight: "100 900",
});

export const viewport: Viewport = {
  themeColor: "#07070A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nurix.ae"),
  title: {
    template: "%s · Nurix",
    default: "Nurix — AI that ships.",
  },
  description:
    "Chatbots, dashboards, and AI agents for UAE businesses. Fixed price. Delivered in days.",
  keywords: [
    "AI automation Dubai",
    "WhatsApp chatbot UAE",
    "Meta Cloud API WhatsApp bot",
    "custom admin dashboards Dubai",
    "AI agents UAE",
    "Next.js web development Dubai",
    "business automation Dubai",
    "SME automation UAE",
    "fixed price AI development",
  ],
  authors: [{ name: "Nurix AI Studio", url: "https://nurix.ae" }],
  creator: "Nurix",
  publisher: "Nurix",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://nurix.ae",
    languages: {
      "en-AE": "https://nurix.ae",
      "ar-AE": "https://nurix.ae/ar",
      "x-default": "https://nurix.ae",
    },
  },
  openGraph: {
    title: "Nurix — AI that ships.",
    description:
      "Chatbots, dashboards, and AI agents for UAE businesses. Fixed price. Delivered in days.",
    url: "https://nurix.ae",
    siteName: "Nurix",
    locale: "en_AE",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Nurix — AI that ships.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nurix — AI that ships.",
    description:
      "Chatbots, dashboards, and AI agents for UAE businesses. Fixed price. Delivered in days.",
    site: "@nurix_ae",
    creator: "@nurix_ae",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} dark noise-overlay`}
      suppressHydrationWarning
    >
      <body className="bg-signal-bg text-signal-text antialiased font-sans selection:bg-violet-600/30 selection:text-violet-200">
        {/* Accessible Skip to Main Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#07070A] font-medium text-sm transition-all"
        >
          Skip to main content
        </a>

        <TooltipProvider>
          <CursorGlow />
          <Nav />
          <main id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <Toaster />
        </TooltipProvider>

        {/* Real-time Web Vitals and Page Traffic Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
