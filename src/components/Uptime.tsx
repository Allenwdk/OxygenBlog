'use client';

import { useState, useEffect } from 'react';

interface UptimeProps {
  startDate: string; // 格式: YYYY-MM-DD
  className?: string;
}

export function Uptime({ startDate, className = '' }: UptimeProps) {
  const [uptime, setUptime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateUptime = () => {
      const start = new Date(startDate);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      
      // 计算天数、小时、分钟和秒数
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setUptime({ days, hours, minutes, seconds });
    };

    // 立即计算一次
    calculateUptime();
    
    // 每秒更新一次
    const interval = setInterval(calculateUptime, 1000);
    
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <span className={className}>
      已稳定运行：{uptime.days}天{uptime.hours}小时{uptime.minutes}分钟{uptime.seconds}秒
    </span>
  );
}