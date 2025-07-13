import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeColorProvider } from "@/hooks/useThemeColor";
import { webTitle, webDescription, backgroundImage, enableBackground } from "@/setting/WebSetting";

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
  // 处理背景图片路径
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const fullImagePath = enableBackground && backgroundImage ? `${basePath}${backgroundImage}` : '';

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var resolvedTheme = theme === 'system' ? systemTheme : theme;
                  
                  if (resolvedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  
                  // 预加载主题色设置
                  var themeColor = localStorage.getItem('theme-color') || 'blue';
                  var customTheme = null;
                  
                  if (themeColor === 'custom') {
                    try {
                      customTheme = JSON.parse(localStorage.getItem('custom-theme') || 'null');
                    } catch (e) {
                      themeColor = 'blue';
                    }
                  }
                  
                  // 预定义的主题色方案
                  var themeSchemes = {
                    blue: {
                      light: {
                        primary: 'oklch(0.6 0.15 250)',
                        primaryForeground: 'oklch(0.98 0.02 250)',
                        secondary: 'oklch(0.95 0.02 250)',
                        accent: 'oklch(0.9 0.05 250)',
                        accentForeground: 'oklch(0.3 0.1 250)'
                      },
                      dark: {
                        primary: 'oklch(0.7 0.15 250)',
                        primaryForeground: 'oklch(0.1 0.02 250)',
                        secondary: 'oklch(0.15 0.02 250)',
                        accent: 'oklch(0.2 0.05 250)',
                        accentForeground: 'oklch(0.8 0.1 250)'
                      }
                    },
                    green: {
                      light: {
                        primary: 'oklch(0.55 0.15 140)',
                        primaryForeground: 'oklch(0.98 0.02 140)',
                        secondary: 'oklch(0.95 0.02 140)',
                        accent: 'oklch(0.9 0.05 140)',
                        accentForeground: 'oklch(0.3 0.1 140)'
                      },
                      dark: {
                        primary: 'oklch(0.65 0.15 140)',
                        primaryForeground: 'oklch(0.1 0.02 140)',
                        secondary: 'oklch(0.15 0.02 140)',
                        accent: 'oklch(0.2 0.05 140)',
                        accentForeground: 'oklch(0.8 0.1 140)'
                      }
                    },
                    purple: {
                      light: {
                        primary: 'oklch(0.6 0.15 300)',
                        primaryForeground: 'oklch(0.98 0.02 300)',
                        secondary: 'oklch(0.95 0.02 300)',
                        accent: 'oklch(0.9 0.05 300)',
                        accentForeground: 'oklch(0.3 0.1 300)'
                      },
                      dark: {
                        primary: 'oklch(0.7 0.15 300)',
                        primaryForeground: 'oklch(0.1 0.02 300)',
                        secondary: 'oklch(0.15 0.02 300)',
                        accent: 'oklch(0.2 0.05 300)',
                        accentForeground: 'oklch(0.8 0.1 300)'
                      }
                    },
                    orange: {
                      light: {
                        primary: 'oklch(0.65 0.15 50)',
                        primaryForeground: 'oklch(0.98 0.02 50)',
                        secondary: 'oklch(0.95 0.02 50)',
                        accent: 'oklch(0.9 0.05 50)',
                        accentForeground: 'oklch(0.3 0.1 50)'
                      },
                      dark: {
                        primary: 'oklch(0.75 0.15 50)',
                        primaryForeground: 'oklch(0.1 0.02 50)',
                        secondary: 'oklch(0.15 0.02 50)',
                        accent: 'oklch(0.2 0.05 50)',
                        accentForeground: 'oklch(0.8 0.1 50)'
                      }
                    },
                    red: {
                      light: {
                        primary: 'oklch(0.6 0.15 20)',
                        primaryForeground: 'oklch(0.98 0.02 20)',
                        secondary: 'oklch(0.95 0.02 20)',
                        accent: 'oklch(0.9 0.05 20)',
                        accentForeground: 'oklch(0.3 0.1 20)'
                      },
                      dark: {
                        primary: 'oklch(0.7 0.15 20)',
                        primaryForeground: 'oklch(0.1 0.02 20)',
                        secondary: 'oklch(0.15 0.02 20)',
                        accent: 'oklch(0.2 0.05 20)',
                        accentForeground: 'oklch(0.8 0.1 20)'
                      }
                    }
                  };
                  
                  // 应用主题色
                  var scheme = customTheme || themeSchemes[themeColor] || themeSchemes.blue;
                  var colors = resolvedTheme === 'dark' ? scheme.dark : scheme.light;
                  var root = document.documentElement;
                  
                  if (colors) {
                    root.style.setProperty('--color-primary', colors.primary);
                    root.style.setProperty('--color-primary-foreground', colors.primaryForeground);
                    root.style.setProperty('--color-secondary', colors.secondary);
                    root.style.setProperty('--color-accent', colors.accent);
                    root.style.setProperty('--color-accent-foreground', colors.accentForeground);
                  }
                  
                  // 设置初始化标记
                  root.style.setProperty('--theme-initialized', '1');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-foreground transition-colors duration-300`}
        style={{
          colorScheme: 'light dark',
          backgroundColor: fullImagePath ? 'transparent' : 'hsl(var(--background))',
          ...(fullImagePath && {
            backgroundImage: `url("${fullImagePath}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          })
        }}
      >
        <ThemeColorProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="theme"
          >
            <Navigation />
            <main className="min-h-screen transition-colors duration-300 relative">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </ThemeColorProvider>
      </body>
    </html>
  );
}
