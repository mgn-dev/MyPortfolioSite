import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Montserrat } from "next/font/google";
import { getSiteContent } from "@/lib/pocketbase";
import { plainTextFromMarkdown } from "@/components/portfolio/bio-markdown";
import "./globals.css";

export const dynamic = "force-dynamic";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: `${site.name} — Portfolio`,
    description: plainTextFromMarkdown(site.bio),
  };
}

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
    var pref = v === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', pref === 'dark');
    document.documentElement.setAttribute('data-theme-pref', pref);
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
