#!/usr/bin/env node

/**
 * 主题色同步脚本 - 静态生成版本
 * 直接读取 WebSetting.ts 中的主题色配置，并更新 globals.css 中的默认主题色
 * 确保静态生成的网站在首次加载时就使用正确的主题色，避免闪烁
 */

const fs = require('fs');
const path = require('path');

// 文件路径
const webSettingPath = path.join(__dirname, '../src/setting/WebSetting.ts');
const globalsCssPath = path.join(__dirname, '../src/app/globals.css');

/**
 * 将十六进制颜色转换为 oklch 格式
 * @param {string} hex - 十六进制颜色值
 * @param {boolean} isDark - 是否为深色模式
 * @returns {string} oklch 格式的颜色值
 */
function hexToOklch(hex, isDark = false) {
  // 移除 # 符号
  hex = hex.replace('#', '');
  
  // 转换为 RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  // RGB 到 HSL 转换
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  // 计算亮度
  let lightness = (max + min) / 2;
  
  // 根据模式调整亮度
  if (isDark) {
    lightness = Math.min(0.8, lightness + 0.2);
  } else {
    lightness = Math.max(0.3, lightness - 0.1);
  }
  
  // 计算饱和度
  let chroma = 0;
  if (diff !== 0) {
    chroma = diff / (1 - Math.abs(2 * lightness - 1));
    chroma = Math.min(0.4, chroma * 0.8); // 限制饱和度
  }
  
  // 计算色相
  let hue = 0;
  if (diff !== 0) {
    if (max === r) {
      hue = ((g - b) / diff) % 6;
    } else if (max === g) {
      hue = (b - r) / diff + 2;
    } else {
      hue = (r - g) / diff + 4;
    }
    hue = hue * 60;
    if (hue < 0) hue += 360;
  }
  
  return `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`;
}

/**
 * 从 WebSetting.ts 中提取当前主题色配置
 * @returns {Object} 主题色配置对象
 */
function extractThemeColors() {
  try {
    const content = fs.readFileSync(webSettingPath, 'utf8');
    
    // 提取当前使用的主题
    const currentThemeMatch = content.match(/export const themeColors = themePresets\.(\w+);/);
    if (!currentThemeMatch) {
      throw new Error('无法找到 themeColors 配置');
    }
    
    const currentTheme = currentThemeMatch[1];
    console.log(`🎨 检测到当前主题: ${currentTheme}`);
    
    // 提取对应主题的颜色值
    const themeRegex = new RegExp(`${currentTheme}:\\s*\\{([^}]+)\\}`, 's');
    const themeMatch = content.match(themeRegex);
    
    if (!themeMatch) {
      throw new Error(`无法找到主题 ${currentTheme} 的配置`);
    }
    
    const themeContent = themeMatch[1];
    const primaryMatch = themeContent.match(/primary:\s*["']([^"']+)["']/);
    const secondaryMatch = themeContent.match(/secondary:\s*["']([^"']+)["']/);
    const accentMatch = themeContent.match(/accent:\s*["']([^"']+)["']/);
    
    if (!primaryMatch || !secondaryMatch || !accentMatch) {
      throw new Error('无法解析主题色值');
    }
    
    return {
      primary: primaryMatch[1],
      secondary: secondaryMatch[1],
      accent: accentMatch[1],
      themeName: currentTheme
    };
  } catch (error) {
    console.error('❌ 提取主题色失败:', error.message);
    process.exit(1);
  }
}

/**
 * 更新 globals.css 中的主题色
 * @param {Object} colors - 主题色配置
 */
function updateGlobalsCss(colors) {
  try {
    let content = fs.readFileSync(globalsCssPath, 'utf8');
    
    // 生成新的颜色值
    const lightPrimary = hexToOklch(colors.primary, false);
    const lightSecondary = hexToOklch(colors.secondary, false);
    const lightAccent = hexToOklch(colors.accent, false);
    
    const darkPrimary = hexToOklch(colors.primary, true);
    const darkSecondary = hexToOklch(colors.secondary, true);
    const darkAccent = hexToOklch(colors.accent, true);
    
    // 更新浅色模式的主题色注释
    content = content.replace(
      /\/\* 主题色变量 - 默认使用.*主题 \*\//,
      `/* 主题色变量 - 默认使用${colors.themeName}主题 */`
    );
    
    // 更新浅色模式的主题色
    content = content.replace(
      /--color-primary:\s*oklch\([^)]+\);/,
      `--color-primary: ${lightPrimary};`
    );
    content = content.replace(
      /--color-secondary:\s*oklch\([^)]+\);/,
      `--color-secondary: ${lightSecondary};`
    );
    content = content.replace(
      /--color-accent:\s*oklch\([^)]+\);/,
      `--color-accent: ${lightAccent};`
    );
    
    // 更新深色模式的主题色注释
    content = content.replace(
      /\/\* 主题色变量 - 深色模式默认使用.*主题 \*\//,
      `/* 主题色变量 - 深色模式默认使用${colors.themeName}主题 */`
    );
    
    // 更新深色模式的主题色
    const darkSectionRegex = /(\.dark\s*\{[\s\S]*?)--color-primary:\s*oklch\([^)]+\);/;
    content = content.replace(darkSectionRegex, `$1--color-primary: ${darkPrimary};`);
    
    const darkSecondaryRegex = /(\.dark\s*\{[\s\S]*?)--color-secondary:\s*oklch\([^)]+\);/;
    content = content.replace(darkSecondaryRegex, `$1--color-secondary: ${darkSecondary};`);
    
    const darkAccentRegex = /(\.dark\s*\{[\s\S]*?)--color-accent:\s*oklch\([^)]+\);/;
    content = content.replace(darkAccentRegex, `$1--color-accent: ${darkAccent};`);
    
    // 写入更新后的内容
    fs.writeFileSync(globalsCssPath, content, 'utf8');
    
    console.log('✅ globals.css 主题色已更新');
    console.log(`   主色调: ${colors.primary} -> ${lightPrimary} (浅色) / ${darkPrimary} (深色)`);
    console.log(`   次要色: ${colors.secondary} -> ${lightSecondary} (浅色) / ${darkSecondary} (深色)`);
    console.log(`   强调色: ${colors.accent} -> ${lightAccent} (浅色) / ${darkAccent} (深色)`);
    
  } catch (error) {
    console.error('❌ 更新 globals.css 失败:', error.message);
    process.exit(1);
  }
}

/**
 * 更新 layout.tsx 中的内联脚本，使用正确的主题色
 * @param {Object} colors - 主题色配置
 */
function updateLayoutScript(colors) {
  try {
    const layoutPath = path.join(__dirname, '../src/app/layout.tsx');
    let content = fs.readFileSync(layoutPath, 'utf8');
    
    // 更新注释
    content = content.replace(
      /\/\/ 立即应用.*主题色，避免闪烁/,
      `// 立即应用${colors.themeName}主题色，避免闪烁`
    );
    
    // 更新主题配置注释
    content = content.replace(
      /\/\/ \w+主题配置/,
      `// ${colors.themeName}主题配置`
    );
    
    // 更新主题色配置
    const themeColorsRegex = /var themeColors = \{[\s\S]*?\};/;
    const newThemeConfig = `var themeColors = {
                    primary: "${colors.primary}",
                    secondary: "${colors.secondary}", 
                    accent: "${colors.accent}"
                  };`;
    
    content = content.replace(themeColorsRegex, newThemeConfig);
    
    fs.writeFileSync(layoutPath, content, 'utf8');
    console.log('✅ layout.tsx 内联脚本已更新');
    
  } catch (error) {
    console.error('❌ 更新 layout.tsx 失败:', error.message);
    // 这个不是致命错误，继续执行
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始同步主题色到静态文件...');
  
  // 提取主题色配置
  const colors = extractThemeColors();
  
  // 更新 CSS 文件
  updateGlobalsCss(colors);
  
  // 更新 layout 脚本
  updateLayoutScript(colors);
  
  console.log('🎉 主题色同步完成！静态生成时将使用正确的主题色。');
}

// 执行脚本
if (require.main === module) {
  main();
}

module.exports = { extractThemeColors, updateGlobalsCss };