import { Geist_Mono, Montserrat } from "next/font/google";

// Shared by the root layouts and global-not-found.tsx (which bypasses them).
// Montserrat: a free, geometric sans in the spirit of Gotham, for all text.
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
});

// Code in the mockups, section numbers and small labels.
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const fontClasses = `${montserrat.variable} ${geistMono.variable} antialiased`;
