import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SegmentationProvider } from "@/context/SegmentationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SegmentAI — Customer Intelligence & Behavioral Segmentation Platform",
  description:
    "Autonomous enterprise customer segmentation suite featuring K-Means behavioral clustering, RFM matrix heatmaps, churn risk mitigation, and generative marketing copilot.",
  keywords: [
    "Customer Segmentation",
    "RFM Analysis",
    "Behavioral Clustering",
    "Customer Lifetime Value",
    "Churn Prediction",
    "AI Marketing Copilot",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
        <SegmentationProvider>
          {children}
        </SegmentationProvider>
      </body>
    </html>
  );
}
