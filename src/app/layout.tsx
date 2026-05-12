import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alex Morgan — Portfolio",
  description:
    "Minimal portfolio — design, front-end development, and selected projects.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeScript = `
(function(){
  try {
    var k = 'portfolio-theme';
    var v = localStorage.getItem(k);
    var dark = false;
    if (v === 'dark') dark = true;
    else if (v === 'light') dark = false;
    else dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.setAttribute('data-theme-pref', v || 'system');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${jetbrainsMono.variable} min-h-dvh antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh min-w-0 flex-col font-sans">{children}</body>
    </html>
  );
}
