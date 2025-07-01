import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { beianhao, ICP, year, name, aWord } from "@/setting/FooterSetting";
import { webTitle, webDescription } from "@/setting/WebSetting";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: webTitle,
  description: webDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navigation />
          <main className="min-h-screen bg-cover bg-center bg-no-repeat">
            {children}
          </main>
          <footer className="bg-white/90 dark:bg-gray-900/90 border-t border-gray-200/20 dark:border-gray-700/20 text-gray-600 dark:text-gray-400 py-3">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p>{beianhao} {ICP} &copy;  {year} {name}  ·  {aWord}</p>
            </div>
          </footer>
          
          {/* 性能监控组件 */}
          {/* <PerformanceMonitor position="bottom-right" /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
