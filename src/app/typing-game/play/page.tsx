'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Pause, RotateCcw, Home } from 'lucide-react';

interface TypingStats {
  cps: number;
  accuracy: number;
  totalChars: number;
  correctChars: number;
  timeElapsed: number;
}

export default function TypingGame() {
  const router = useRouter();
  const [code, setCode] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [stats, setStats] = useState<TypingStats>({
    cps: 0,
    accuracy: 100,
    totalChars: 0,
    correctChars: 0,
    timeElapsed: 0
  });
  const [showResults, setShowResults] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedCode = sessionStorage.getItem('typingGameCode');
    const savedFileName = sessionStorage.getItem('typingGameFileName');
    
    if (savedCode && savedFileName) {
      setCode(savedCode);
      setFileName(savedFileName);
      sessionStorage.removeItem('typingGameCode');
      sessionStorage.removeItem('typingGameFileName');
    } else {
      router.push('/typing-game/setup');
    }
  }, [router]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      const interval = setInterval(() => {
        const timeElapsed = (Date.now() - startTime) / 1000;
        const cps = currentIndex > 0 ? currentIndex / timeElapsed : 0;
        const accuracy = currentIndex > 0 ? (stats.correctChars / currentIndex) * 100 : 100;
        
        setStats(prev => ({
          ...prev,
          cps: Math.round(cps * 10) / 10,
          accuracy: Math.round(accuracy * 10) / 10,
          timeElapsed: Math.round(timeElapsed)
        }));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlaying, isPaused, startTime, currentIndex, stats.correctChars]);



  const handlePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      // 如果是暂停操作，保持焦点在输入框
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleReset = () => {
    setUserInput('');
    setCurrentIndex(0);
    setIsPlaying(false);
    setIsPaused(false);
    setShowResults(false);
    setStats({
      cps: 0,
      accuracy: 0,
      timeElapsed: 0,
      correctChars: 0,
      totalChars: 0
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 如果游戏还没开始，现在开始
    if (!isPlaying) {
      setIsPlaying(true);
      setStartTime(Date.now());
    }

    if (!isPlaying || isPaused) return;

    // 处理退格键
    if (e.key === 'Backspace') {
      if (userInput.length > 0) {
        setUserInput(prev => prev.slice(0, -1));
        setCurrentIndex(prev => Math.max(0, prev - 1));
      }
      return;
    }

    // 忽略功能键
    if (e.key.length > 1 || e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    const newChar = e.key;
    const expectedChar = code[userInput.length];
    
    // 无论对错都接受输入
    setUserInput(prev => prev + newChar);
    
    if (newChar === expectedChar) {
      // 正确输入
      setCurrentIndex(prev => prev + 1);
      setStats(prev => ({
        ...prev,
        correctChars: prev.correctChars + 1,
        totalChars: prev.totalChars + 1
      }));
    } else {
      // 错误输入 - 也前进但标记为错误
      setCurrentIndex(prev => prev + 1);
      setStats(prev => ({
        ...prev,
        totalChars: prev.totalChars + 1
      }));
    }

    // 检查是否完成
    if (userInput.length + 1 >= code.length) {
      setIsPlaying(false);
      setShowResults(true);
    }
  };

  const renderCodeWithHighlight = () => {
    const lines = code.split('\n');
    return lines.map((line, lineIndex) => {
      const chars = line.split('');
      return (
        <div key={lineIndex} className="flex">
          {chars.map((char, charIndex) => {
            const globalIndex = lines.slice(0, lineIndex).join('\n').length + (lineIndex > 0 ? 1 : 0) + charIndex;
            const isTyped = globalIndex < currentIndex;
            const isCorrect = isTyped && userInput[globalIndex] === char;
            const isCurrent = globalIndex === currentIndex;
            const isError = isTyped && userInput[globalIndex] !== char;
            
            return (
              <span
                key={charIndex}
                className={`
                  ${isCorrect ? 'bg-green-500/20 dark:bg-green-500/30' : ''}
                  ${isError ? 'bg-red-500/20 dark:bg-red-500/30 border-b-2 border-red-500' : ''}
                  ${isCurrent ? 'relative' : ''}
                  ${!isTyped ? 'opacity-50' : ''}
                  transition-colors duration-100
                `}
              >
                {char}
                {isCurrent && isPlaying && !isPaused && (
                  <span className="absolute -left-0.5 top-0 w-0.5 h-full bg-blue-500 dark:bg-blue-400 animate-pulse" style={{ animation: 'pulse 1s infinite' }}></span>
                )}
              </span>
            );
          })}
          {/* 处理换行符 */}
          {lineIndex < lines.length - 1 && (
            <span
              className={`
                ${(lines.slice(0, lineIndex).join('\n').length + line.length) < currentIndex ? 'bg-green-500/20 dark:bg-green-500/30' : ''}
                ${(lines.slice(0, lineIndex).join('\n').length + line.length) === currentIndex ? 'relative' : ''}
                ${(lines.slice(0, lineIndex).join('\n').length + line.length) >= currentIndex ? 'opacity-50' : ''}
              `}
            >
              
              {(lines.slice(0, lineIndex).join('\n').length + line.length) === currentIndex && isPlaying && !isPaused && (
                <span className="absolute -left-0.5 top-0 w-0.5 h-full bg-blue-500 dark:bg-blue-400 animate-pulse" style={{ animation: 'pulse 1s infinite' }}></span>
              )}
            </span>
          )}
        </div>
      );
    });
  };

  if (showResults) {
    return (
      <div className="min-h-screen pt-[65px] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800 dark:text-white mb-2">游戏结束!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-gray-600 dark:text-gray-300 text-sm">CPS</p>
                <p className="text-gray-800 dark:text-white text-2xl font-bold">{stats.cps}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-gray-600 dark:text-gray-300 text-sm">准确率</p>
                <p className="text-gray-800 dark:text-white text-2xl font-bold">{stats.accuracy}%</p>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm">用时</p>
              <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.timeElapsed}秒</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleReset} className="flex-1 bg-primary hover:bg-primary/90">
                <RotateCcw className="w-4 h-4 mr-2" />
                重新开始
              </Button>
              <Button onClick={() => router.push('/typing-game/setup')} className="flex-1 bg-secondary hover:bg-secondary/90">
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[65px] p-4">
      <div className="max-w-6xl mx-auto">
          {/* 头部信息 */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg p-6 space-y-6 mb-6">
          <div className="text-gray-800 dark:text-white">
              <h1 className="text-2xl font-bold">微软大战代码</h1>
              <p className="text-gray-600 dark:text-gray-300">{fileName}</p>
              {!isPlaying && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">按下任意键开始...</p>
              )}
          </div>
          <div className="flex gap-2">
            {isPlaying && (
              <Button
                onClick={handlePause}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Pause className="w-4 h-4 mr-2" />
                {isPaused ? '继续' : '暂停'}
              </Button>
            )}
            <Button
              onClick={handleReset}
              className="bg-primary hover:bg-primary/90"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              重置
            </Button>
            <Button
              onClick={() => router.push('/typing-game/setup')}
              className="bg-secondary hover:bg-secondary/90"
            >
              <Home className="w-4 h-4 mr-2" />
              返回
            </Button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">CPS</p>
            <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.cps}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">准确率</p>
            <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.accuracy}%</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">进度</p>
            <p className="text-gray-800 dark:text-white text-xl font-bold">
              {currentIndex}/{code.length}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">时间</p>
            <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.timeElapsed}s</p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-6">
          <Progress 
            value={(currentIndex / code.length) * 100} 
            className="h-2 bg-gray-200 dark:bg-gray-700"
          />
        </div>

        {/* 代码输入区域 */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">代码输入</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg p-6 font-mono text-sm leading-relaxed relative cursor-text select-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              onClick={focusInput}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              ref={inputRef}
            >
              <div className="whitespace-pre-wrap break-all max-h-96 overflow-y-auto text-gray-800 dark:text-gray-200">
                {renderCodeWithHighlight()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}