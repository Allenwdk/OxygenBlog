import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 只在构建时启用静态导出，开发时禁用以避免 generateStaticParams 错误
  ...(process.env.NODE_ENV === "production" && { output: "export" }),
  trailingSlash: true,
  // 静态导出时的资源前缀配置
  ...(process.env.NODE_ENV === "production" && {
    // 移除 assetPrefix，使用默认的相对路径
    // assetPrefix: './',
    basePath: "",
  }),
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
    // 静态导出时必须禁用图片优化
    unoptimized: process.env.NODE_ENV === "production",
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
  // 确保正确处理Unicode字符
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  // 只在非静态导出模式下启用rewrites
  ...(process.env.NODE_ENV !== "production" && {
    async rewrites() {
      return {
        beforeFiles: [],
        afterFiles: [],
        fallback: [],
      };
    },
  }),
};

export default nextConfig;
