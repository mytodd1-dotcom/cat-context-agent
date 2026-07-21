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
const title = "CAT Schema Remediation Agent | DataHub Hackathon Submission";
const description =
  "A DataHub agent that reads real schema and lineage context through the official MCP server, then prepares approval-gated metadata remediation.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "CAT Context Agent",
  title,
  description,
  keywords: [
    "CAT Context Agent",
    "DataHub",
    "MCP Server",
    "DataHub Agent Hackathon",
    "governance",
    "schema remediation",
    "metadata governance",
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
        alt: "CAT Schema Remediation Agent social preview showing DataHub context flowing into an approval-gated fix.",
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
