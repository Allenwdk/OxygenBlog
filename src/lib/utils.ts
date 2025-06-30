import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
 * @param dateInput - 日期字符串或 undefined
 * @param defaultDate - 默认日期，当输入无效时使用
 * @returns 格式化后的日期字符串 (YYYY-MM-DD)
 */
export function formatBlogDate(dateInput?: string, defaultDate: string = '2024-01-01'): string {
  if (!dateInput) {
    return defaultDate;
  }
  
  try {
    // 尝试解析各种日期格式
    let date: Date;
    
    // 处理常见的日期格式
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      // YYYY-MM-DD 格式
      date = new Date(dateInput + 'T00:00:00.000Z');
    } else if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/.test(dateInput)) {
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
