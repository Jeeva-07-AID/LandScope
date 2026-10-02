import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LANDScope — AI-Powered Land Intelligence & Policy Innovation Platform",
  description:
    "National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance. Explore. Analyze. Simulate. Decide. (Problem Statement: SIH26019)",
  keywords: [
    "LANDScope",
    "SIH 2026",
    "SIH26019",
    "Land Intelligence",
    "Cadastral GIS",
    "Policy Simulation",
    "DILRMP",
    "SVAMITVA",
    "Digital India",
    "Land Governance",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
