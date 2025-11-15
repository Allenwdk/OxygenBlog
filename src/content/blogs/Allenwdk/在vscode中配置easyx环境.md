---
title: 在VSCode中配置EasyX环境
date: 2025-11-15
category: 技术
tags: [C, VSCode, EasyX]
readTime: 10
excerpt: 在VSCode中配置EasyX环境的简单方法总结
author: Allenwdk
---


# 在VSCode中配置EasyX环境

## 准备工作
- 一个安装好并配置好mingw的C语言环境的VSCode
- 在[EasyX官网](https://codebus.cn/bestans/easyx-for-mingw)下载`easyx4mingw_25.9.10`

## 复制库文件
1. 解压下载好的`easyx4mingw_25.9.10.zip`
2. 将解压得到的`include/easyx.h`和`include/graphics.h`复制到`你的mingw安装目录(通常名为msys64)/ucrt64/include`中
3. 将得到的`lib64/libeasyxw.a`和`lib64/libeasyx.a`复制到`你的mingw安装目录(通常名为msys64)/ucrt64/lib`中

## 配置VSCode
1. 在VSCode中打开项目，打开`.vscode/task.json`，确保生成活动文件使用的是g++.exe而不是gcc.exe
2. 在`"args"`中加入`"-leasyx",`
3. 打开刚才复制的`easyx.h`，在开头加入代码`void* __imp___iob_func=0;`并保存
4. 新建文件，粘贴测试代码


```
#include <graphics.h>
#include <conio.h>

int main()
{
    initgraph(640, 480);
    circle(320, 240, 100);
    _getch();
    return 0;
}
```


5. 运行，查看能否出现窗口

## 注意事项
- EasyX需要一些c++特性，保存文件时请确保后缀名为.cpp而不是.c，否则会报错
- 在新的项目文件夹中或许需要重新配置`task.json`
- 大家在删项目目录中临时文件的时候全选完记得看看有没有选中`.vscode`，防止手快了给配置文件也删了（别问我怎么知道的）

参考链接


> https://blog.csdn.net/djc3501558870/article/details/136592196


> https://docs.easyx.cn/zh-cn/c-cpp


> https://blog.csdn.net/apple_67940889/article/details/146989764
