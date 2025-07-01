import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 只在构建时启用静态导出，开发时禁用以避免 generateStaticParams 错误
  ...(process.env.NODE_ENV === 'production' && { output: "export" }),
  trailingSlash: true,
  images: {
    // 允许的外部图片域名
    domains: [
      "localhost",
      "example.com",
      "images.unsplash.com",
      "cdn.jsdelivr.net",
      "raw.githubusercontent.com",
    ],
    // 图片格式优化
    formats: ["image/webp", "image/avif"],
    // 启用图片优化
    unoptimized: false,
    // 图片尺寸配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 启用实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: ["react-markdown", "remark-gfm", "rehype-katex"],
  },
  // 压缩配置
  compress: true,
  // 支持Unicode字符的路由
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: []
    };
  },
  // 确保正确处理Unicode字符
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
