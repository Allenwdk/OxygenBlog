'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileCode, Keyboard } from 'lucide-react';

export default function TypingGameSetup() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.js') || file.name.endsWith('.ts') || file.name.endsWith('.jsx') || file.name.endsWith('.tsx') || file.name.endsWith('.py') || file.name.endsWith('.java') || file.name.endsWith('.cpp') || file.name.endsWith('.c'))) {
      setSelectedFile(file);
    } else {
      alert('请选择支持的代码文件格式 (.js, .ts, .jsx, .tsx, .py, .java, .cpp, .c)');
    }
  };

  const startGame = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        sessionStorage.setItem('typingGameCode', content);
        sessionStorage.setItem('typingGameFileName', selectedFile.name);
        router.push('/typing-game/play');
      };
      reader.readAsText(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Keyboard className="w-12 h-12 text-purple-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            微软大战代码
          </CardTitle>
          <CardDescription className="text-purple-200">
            上传代码文件，开始你的打字练习之旅
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-purple-400 rounded-lg p-8 text-center hover:border-purple-300 transition-colors">
            <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-white mb-4">上传代码文件开始游戏</p>
            <input
              type="file"
              accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors"
            >
              <FileCode className="w-5 h-5 mr-2" />
              选择文件
            </label>
          </div>
          
          {selectedFile && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
              <p className="text-green-200 mb-2">已选择文件:</p>
              <p className="text-white font-mono">{selectedFile.name}</p>
              <p className="text-green-200 text-sm mt-1">
                大小: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <Button
            onClick={startGame}
            disabled={!selectedFile}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            开始游戏
          </Button>

          <div className="text-center text-purple-200 text-sm">
            <p>支持的文件格式: .js, .ts, .jsx, .tsx, .py, .java, .cpp, .c</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}