import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { THEME_KEY } from "@/lib/theme";
import "./globals.css";

// Geist for everything, Geist Mono for the small uppercase labels: the faces the Relay
// mock settled on. next/font self-hosts both, so no request goes to Google.
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "VA Marketplace by Scale Virtually: hire a vetted virtual assistant",
  description:
    "Browse vetted virtual assistants the day you sign up and interview within 2 business days. Backed by a 90-day replacement guarantee.",
};

// The page ground in each theme, so the browser chrome on phones matches it.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efefed" },
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
  ],
};

// Runs while the HTML is parsed, before the first paint, so a dark-mode visitor never sees
// a light flash (see Next's "preventing flash before hydration" guide). The attribute is
// always set, resolving the OS preference when nothing is stored; `suppressHydrationWarning`
// on <html> covers the attribute React did not render.
const themeScript = `(function(){var t=null;try{t=localStorage.getItem(${JSON.stringify(THEME_KEY)});}catch(e){}if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Every video still and clip comes from Mux's image service. */}
        <link rel="preconnect" href="https://image.mux.com" />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
