import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// One family for headings and body, so the page loads a single font file. A geometric
// sans, to sit beside the geometric lettering of the Scale Virtually wordmark.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VA Marketplace by Scale Virtually: hire a vetted virtual assistant",
  description:
    "Browse vetted virtual assistants the day you sign up and interview within 2 business days. Backed by a 90-day replacement guarantee.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
