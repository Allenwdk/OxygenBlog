'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Home } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  const handleStart = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setStartTime(Date.now());
    inputRef.current?.focus();
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setUserInput('');
    setCurrentIndex(0);
    setIsPlaying(false);
    setIsPaused(false);
    setStartTime(0);
    setStats({
      cps: 0,
      accuracy: 100,
      totalChars: 0,
      correctChars: 0,
      timeElapsed: 0
    });
    setShowResults(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isPlaying || isPaused) return;

    const input = e.target.value;
    const newIndex = input.length;
    
    if (newIndex <= code.length) {
      setUserInput(input);
      setCurrentIndex(newIndex);
      
      // 更新统计信息
      let correctCount = 0;
      for (let i = 0; i < newIndex; i++) {
        if (input[i] === code[i]) {
          correctCount++;
        }
      }
      
      setStats(prev => ({
        ...prev,
        totalChars: newIndex,
        correctChars: correctCount
      }));

      // 检查是否完成
      if (newIndex === code.length) {
        setIsPlaying(false);
        setShowResults(true);
      }
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
            
            return (
              <span
                key={charIndex}
                className={`
                  ${isTyped ? (isCorrect ? 'bg-green-500/20' : 'bg-red-500/20 underline decoration-red-500') : ''}
                  ${isCurrent ? 'bg-blue-500/30' : ''}
                  transition-colors duration-100
                `}
              >
                {char || ' '}
              </span>
            );
          })}
        </div>
      );
    });
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white mb-2">游戏结束!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-purple-200 text-sm">CPS</p>
                <p className="text-white text-2xl font-bold">{stats.cps}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-purple-200 text-sm">准确率</p>
                <p className="text-white text-2xl font-bold">{stats.accuracy}%</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <p className="text-purple-200 text-sm">用时</p>
              <p className="text-white text-xl font-bold">{stats.timeElapsed}秒</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleReset}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                重新开始
              </Button>
              <Button
                onClick={() => router.push('/typing-game/setup')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
              >
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 头部信息 */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <h1 className="text-2xl font-bold">微软大战代码</h1>
            <p className="text-purple-200">{fileName}</p>
          </div>
          <div className="flex gap-2">
            {!isPlaying ? (
              <Button
                onClick={handleStart}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                开始
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Pause className="w-4 h-4 mr-2" />
                {isPaused ? '继续' : '暂停'}
              </Button>
            )}
            <Button
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              重置
            </Button>
            <Button
              onClick={() => router.push('/typing-game/setup')}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              返回
            </Button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-purple-200 text-sm">CPS</p>
            <p className="text-white text-xl font-bold">{stats.cps}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-purple-200 text-sm">准确率</p>
            <p className="text-white text-xl font-bold">{stats.accuracy}%</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-purple-200 text-sm">进度</p>
            <p className="text-white text-xl font-bold">
              {currentIndex}/{code.length}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-purple-200 text-sm">时间</p>
            <p className="text-white text-xl font-bold">{stats.timeElapsed}s</p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-6">
          <Progress 
            value={(currentIndex / code.length) * 100} 
            className="h-2 bg-white/20"
          />
        </div>

        {/* 代码显示区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">原始代码</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96 font-mono text-sm">
                <SyntaxHighlighter
                  language={fileName.endsWith('.py') ? 'python' : 
                           fileName.endsWith('.java') ? 'java' :
                           fileName.endsWith('.cpp') || fileName.endsWith('.c') ? 'cpp' :
                           'javascript'}
                  style={vs2015}
                  customStyle={{
                    background: 'transparent',
                    margin: 0,
                    padding: 0
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">输入区域</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96 font-mono text-sm">
                <div className="text-gray-300 leading-relaxed">
                  {renderCodeWithHighlight()}
                </div>
              </div>
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                disabled={!isPlaying || isPaused}
                className="w-full h-32 mt-4 p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none resize-none font-mono text-sm"
                placeholder={isPlaying ? "开始输入代码..." : "点击开始按钮开始游戏"}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}