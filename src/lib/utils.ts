import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 计算博客文章的阅读时长
 * 
 * 基于平均阅读速度计算：
 * - 中文：每分钟300字
 * - 英文：每分钟200单词
 * 
 * @param content - 博客内容
 * @param cnCharsPerMinute - 中文每分钟阅读字数，默认为300
 * @param enWordsPerMinute - 英文每分钟阅读单词数，默认为200
 * @returns 阅读时长（分钟），最小为1分钟
 */
export function calculateReadingTime(
  content: string, 
  cnCharsPerMinute: number = 300, 
  enWordsPerMinute: number = 200
): number {
  if (!content) return 1;
  
  // 移除HTML标签和Markdown标记
  const text = content
    .replace(/<\/?[^>]+(>|$)/g, '') // 移除HTML标签
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // 处理Markdown链接和图片
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]*`/g, '') // 移除行内代码
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/\*\*|__|~~|\*|_/g, ''); // 移除加粗、斜体等标记
  
  // 分别计算中文字符和英文单词
  const cnCharCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  
  // 提取所有非中文部分，按空格分割计算英文单词数
  const nonCnText = text.replace(/[\u4e00-\u9fa5]/g, ' ');
  const enWordCount = nonCnText.trim().split(/\s+/).filter(Boolean).length;
  
  // 分别计算中文和英文的阅读时间
  const cnReadingTime = cnCharCount / cnCharsPerMinute;
  const enReadingTime = enWordCount / enWordsPerMinute;
  
  // 计算总阅读时间（分钟）
  const totalReadingTime = Math.ceil(cnReadingTime + enReadingTime);
  
  // 返回至少1分钟的阅读时间
  return Math.max(1, totalReadingTime);
}

/**
 * 格式化博客日期，支持多种日期格式
 * 
 * 支持的格式：
 * - YYYY-MM-DD (如: 2024-01-01)
 * - YYYY-MM-DD HH:mm (如: 2024-01-01 14:30)
 * - YYYY-MM-DD HH:mm:ss (如: 2024-01-01 14:30:45)
 * - ISO 8601 格式 (如: 2024-01-01T14:30:45.123Z)
 * - 其他 JavaScript Date 构造函数支持的格式
 * 
 * @param dateInput - 日期字符串、Date 对象或 undefined
 * @param defaultDate - 默认日期，当输入无效时使用
 * @returns 格式化后的日期字符串 (YYYY-MM-DD)
 */
export function formatBlogDate(dateInput?: string | Date, defaultDate: string = '2024-01-01'): string {
  if (!dateInput) {
    return defaultDate;
  }
  
  try {
    /*
      gray-matter 会把 YAML 里补零的标准日期（date: 2026-02-19）直接解析成 Date 对象，
      只有不补零的（date: 2025-9-24）才留在字符串分支，两种都要处理。
    */
    if (dateInput instanceof Date) {
      if (isNaN(dateInput.getTime())) {
        console.warn(`Invalid date format: ${String(dateInput)}, using default date: ${defaultDate}`);
        return defaultDate;
      }
      return dateInput.toISOString().split('T')[0];
    }

    /*
      先处理「只有日期」的字面形式：YYYY-MM-DD 与不补零的 YYYY-M-D。
      这类输入不该经过 Date 解析：new Date('2025-9-24') 按本地时间解析，
      toISOString() 又转成 UTC，在东八区会回退一天（显示成 2025-09-23）；
      同时不补零的字符串直接做字典序排序也会错位（'2025-9-24' 排在 '2025-10-01' 之后）。
      直接按字面规范化输出最稳，也顺手补齐了前导零。
    */
    const ymd = dateInput.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (ymd) {
      const [, year, month, day] = ymd;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // 尝试解析各种日期格式
    let date: Date;

    // 处理常见的日期格式
    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/.test(dateInput)) {
      // YYYY-MM-DD HH:mm 格式
      date = new Date(dateInput + ':00.000Z');
    } else if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(dateInput)) {
      // YYYY-MM-DD HH:mm:ss 格式
      date = new Date(dateInput + '.000Z');
    } else {
      // 其他格式，直接使用 Date 构造函数
      date = new Date(dateInput);
    }
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${dateInput}, using default date: ${defaultDate}`);
      return defaultDate;
    }
    
    // 返回 YYYY-MM-DD 格式
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error(`Error parsing date: ${dateInput}`, error);
    return defaultDate;
  }
}
