/**
 * 主题色配置(通常不用修改)
 */

export interface ThemeColorScheme {
  name: string;
  displayName: string;
  light: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    accent: string;
    accentForeground: string;
  };
  dark: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    accent: string;
    accentForeground: string;
  };
}

export interface CustomColorConfig {
  primary: string;
  accent: string;
}

/**
 * 预定义主题色方案
 */
export const themeColorSchemes: ThemeColorScheme[] = [
  {
    name: "blue",
    displayName: "蓝色（默认）",
    light: {
      primary: "oklch(0.45 0.25 240)", // 更深的蓝色，提高对比度
      primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.55 0.1 240)", // 中等蓝灰色
      accent: "oklch(0.5 0.2 240)", // 深蓝色强调色
      accentForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.75 0.25 240)", // 更亮的蓝色
      primaryForeground: "oklch(0.1 0.1 240)",
      secondary: "oklch(0.65 0.15 240)", // 亮蓝灰色
      accent: "oklch(0.7 0.2 240)", // 亮蓝色强调色
      accentForeground: "oklch(0.1 0.1 240)",
    },
  },
  {
    name: "gray",
    displayName: "黑白",
    light: {
      primary: "oklch(0.3 0 0)", // 更深的灰色，提高对比度
      primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.5 0 0)", // 中等灰色，确保可读性
      accent: "oklch(0.4 0 0)", // 深灰色强调色
      accentForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.85 0 0)", // 更亮的白色，提高对比度
      primaryForeground: "oklch(0.15 0 0)",
      secondary: "oklch(0.65 0 0)", // 亮灰色，确保可读性
      accent: "oklch(0.75 0 0)", // 亮灰色强调色
      accentForeground: "oklch(0.15 0 0)",
    },
  },
  {
    name: "green",
    displayName: "绿色",
    light: {
      primary: "oklch(0.4 0.25 140)", // 更深的绿色
      primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.5 0.1 140)", // 中等绿灰色
      accent: "oklch(0.45 0.2 140)", // 深绿色强调色
      accentForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.7 0.25 140)", // 更亮的绿色
      primaryForeground: "oklch(0.1 0.1 140)",
      secondary: "oklch(0.6 0.15 140)", // 亮绿灰色
      accent: "oklch(0.65 0.2 140)", // 亮绿色强调色
      accentForeground: "oklch(0.1 0.1 140)",
    },
  },
  {
    name: "purple",
    displayName: "紫色",
    light: {
      primary: "oklch(0.4 0.25 280)", // 更深的紫色
      primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.5 0.1 280)", // 中等紫灰色
      accent: "oklch(0.45 0.2 280)", // 深紫色强调色
      accentForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.75 0.25 280)", // 更亮的紫色
      primaryForeground: "oklch(0.1 0.1 280)",
      secondary: "oklch(0.65 0.15 280)", // 亮紫灰色
      accent: "oklch(0.7 0.2 280)", // 亮紫色强调色
      accentForeground: "oklch(0.1 0.1 280)",
    },
  },
  {
    name: "orange",
    displayName: "橙色",
    light: {
      primary: "oklch(0.5 0.25 40)", // 更深的橙色
      primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.6 0.1 40)", // 中等橙灰色
      accent: "oklch(0.55 0.2 40)", // 深橙色强调色
      accentForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.75 0.25 40)", // 更亮的橙色
      primaryForeground: "oklch(0.1 0.1 40)",
      secondary: "oklch(0.65 0.15 40)", // 亮橙灰色
      accent: "oklch(0.7 0.2 40)", // 亮橙色强调色
      accentForeground: "oklch(0.1 0.1 40)",
    },
  },
  {
    name: "pink",
    displayName: "粉色",
    light: {
      primary: "oklch(0.45 0.25 340)", // 更深的粉色
      primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.55 0.1 340)", // 中等粉灰色
      accent: "oklch(0.5 0.2 340)", // 深粉色强调色
      accentForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.75 0.25 340)", // 更亮的粉色
      primaryForeground: "oklch(0.1 0.1 340)",
      secondary: "oklch(0.65 0.15 340)", // 亮粉灰色
      accent: "oklch(0.7 0.2 340)", // 亮粉色强调色
      accentForeground: "oklch(0.1 0.1 340)",
    },
  },
];

/**
 * 默认主题色方案
 */
export const defaultThemeColor = "blue";

/**
 * 获取主题色方案
 */
export const getThemeColorScheme = (name: string): ThemeColorScheme => {
  return (
    themeColorSchemes.find((scheme) => scheme.name === name) ||
    themeColorSchemes[0]
  );
};

/**
 * 从十六进制颜色生成主题色方案
 */
export const generateThemeFromHex = (
  primaryHex: string,
  accentHex: string,
  name: string = "custom"
): ThemeColorScheme => {
  // 将十六进制转换为 OKLCH（使用更准确的算法）
  const hexToOklch = (hex: string): string => {
    // 移除 # 符号
    hex = hex.replace("#", "");

    // 转换为 RGB (0-1)
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // RGB 到 Linear RGB
    const toLinear = (c: number) => {
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const rLinear = toLinear(r);
    const gLinear = toLinear(g);
    const bLinear = toLinear(b);

    // Linear RGB 到 XYZ (D65)
    const x = 0.4124564 * rLinear + 0.3575761 * gLinear + 0.1804375 * bLinear;
    const y = 0.2126729 * rLinear + 0.7151522 * gLinear + 0.072175 * bLinear;
    const z = 0.0193339 * rLinear + 0.119192 * gLinear + 0.9503041 * bLinear;

    // XYZ 到 OKLab
    const l_ = Math.cbrt(
      0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z
    );
    const m_ = Math.cbrt(
      0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z
    );
    const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z);

    const l = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const b_lab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

    // OKLab 到 OKLCH
    const L = l;
    const C = Math.sqrt(a * a + b_lab * b_lab);
    let H = (Math.atan2(b_lab, a) * 180) / Math.PI;
    if (H < 0) H += 360;

    return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`;
  };

  const primaryOklch = hexToOklch(primaryHex);
  const accentOklch = hexToOklch(accentHex);

  // 提取 OKLCH 值
  const extractOklchValues = (oklch: string) => {
    const match = oklch.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/);
    if (match) {
      return {
        l: parseFloat(match[1]),
        c: parseFloat(match[2]),
        h: parseFloat(match[3]),
      };
    }
    return { l: 0.5, c: 0.1, h: 0 };
  };

  const primaryValues = extractOklchValues(primaryOklch);
  const accentValues = extractOklchValues(accentOklch);

  return {
    name,
    displayName: "自定义",
    light: {
      primary: `oklch(${Math.max(0.3, primaryValues.l * 0.8)} ${
        primaryValues.c
      } ${primaryValues.h})`,
      primaryForeground: "oklch(0.985 0 0)",
      secondary: `oklch(${Math.max(0.5, primaryValues.l)} ${
        primaryValues.c * 0.5
      } ${primaryValues.h})`,
      accent: `oklch(${Math.max(0.4, accentValues.l * 0.8)} ${accentValues.c} ${
        accentValues.h
      })`,
      accentForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: `oklch(${Math.min(0.85, primaryValues.l + 0.3)} ${
        primaryValues.c
      } ${primaryValues.h})`,
      primaryForeground: "oklch(0.15 0 0)",
      secondary: `oklch(${Math.min(0.65, primaryValues.l + 0.2)} ${
        primaryValues.c * 0.7
      } ${primaryValues.h})`,
      accent: `oklch(${Math.min(0.75, accentValues.l + 0.3)} ${
        accentValues.c
      } ${accentValues.h})`,
      accentForeground: "oklch(0.15 0 0)",
    },
  };
};

/**
 * 应用主题色到CSS变量
 */
export const applyThemeColor = (
  colorScheme: string | ThemeColorScheme,
  isDark: boolean = false
) => {
  let scheme: ThemeColorScheme;

  if (typeof colorScheme === "string") {
    scheme = getThemeColorScheme(colorScheme);
  } else {
    scheme = colorScheme;
  }

  const colors = isDark ? scheme.dark : scheme.light;
  const root = document.documentElement;

  // 应用CSS变量
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--primary-foreground", colors.primaryForeground);
  root.style.setProperty("--secondary", colors.secondary);
  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--accent-foreground", colors.accentForeground);

  // 保存到localStorage
  if (typeof colorScheme === "string") {
    localStorage.setItem("theme-color", colorScheme);
  } else {
    localStorage.setItem("custom-theme", JSON.stringify(colorScheme));
  }
};

/**
 * 从localStorage获取保存的主题色
 */
export const getSavedThemeColor = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("theme-color") || defaultThemeColor;
  }
  return defaultThemeColor;
};

/**
 * 从localStorage获取保存的自定义主题
 */
export const getSavedCustomTheme = (): ThemeColorScheme | null => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("custom-theme");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
  }
  return null;
};
