import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = new URL("https://cat-context-agent.flyguy.chatgpt.site");
const title = "CAT Context Agent | DataHub Hackathon Submission";
const description =
  "A submitted DataHub Agent Hackathon project that turns messy business requests into safe queues, approval gates, and receipt-backed decisions.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "CAT Context Agent",
  title,
  description,
  keywords: [
    "CAT Context Agent",
    "DataHub",
    "agent context",
    "DataHub Agent Hackathon",
    "governance",
    "workflow automation",
    "agent receipts",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "CAT Context Agent",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "CAT Context Agent social preview showing messy data flowing through DataHub context into safe agent action.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
