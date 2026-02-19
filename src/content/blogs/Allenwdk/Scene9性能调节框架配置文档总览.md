---
title: Scene 9.0 性能调节框架配置文档总览
date: 2026-02-19
category: 技术
tags: [Scene, Vtools, json]
readTime: 7
excerpt: 本文档整合了 Scene 9.0 性能调节框架的全部配置说明，旨在提供一份详尽、完整的参考指南。
author: Allenwdk
---

# Scene 9.0 性能调节框架配置文档总览

本文档整合了 Scene 9.0 性能调节框架的全部配置说明，旨在提供一份详尽、完整的参考指南。
文档通过AI总结（元宝deepseek深度思考）完成，可能不是很准确，如需参考建议前往scene官网docs文件夹查看具体内容。

## 一、框架概述与基础结构

### 1.1 适用版本与组成
- 本文档根据 **Scene 9.0 框架特性**编写。
- 一套完整的性能调节配置通常包含以下文件：
    ```sh
    profile.json        # 方案配置主文件 *必需
    manifest.json       # 方案描述文件 *必需
    powercfg.sh         # 方案初始化脚本（可选，仅在scene-daemon启动或配置更新后首次档位切换前执行一次）
    threads.json        # 线程配置文件（可选）
    ```
- **状态缓存提示**：Scene 会缓存配置信息。在 `/data/data/com.omarea.vtools/files` 下的修改不会即时生效，需要重启手机或终止 `scene-daemon` 进程以重新加载配置。

### 1.2 空配置与模式定义
最基本的 `profile.json` 结构如下，定义了五个性能档位：
```json
{
  "reset": [],
  "schemes": {
    "powersave": { "call": [], "app": [], "game": [] }, // 省电模式
    "balance": { "call": [], "app": [], "game": [] },    // 均衡模式
    "performance": { "call": [], "app": [], "game”: [] }, // 性能模式
    "fast”: { "call”: [], “app”: [], “game”: [] },       // 极速模式
    “pedestal”: { “call”: [], “app”: [], “game”: [] }    // 底座模式（需在manifest中声明）
  }
}
```
- `call`: 当前模式下的公共设定。
- `app` / `game`: 分别用于“普通APP”和“游戏”的额外设定。

### 1.3 描述文件 (Manifest)
描述文件用于定义配置方案在 Scene 中的展示信息。
- **内部配置** (`manifest.json`):
    ```json
    {
      "version": “配置名称",
      “versionCode”: 20230528001, // 配置号
      “author”: “作者名",
      “projectUrl”: “http://vtools.omarea.com/”,
      “features”: {
        “pedestal”: false, // 是否支持底座模式
        “reboot”: false,   // 切换后是否需要重启
        “fas”: false       // 是否支持FAS
      }
    }
    ```
- **外部配置** (`powercfg.json`): 用于安装到 `/data` 目录的配置，额外包含 `files`（相关文件路径）和 `module`（相关Magisk模块ID）字段，以便在Scene中切换配置源时清理文件。

## 二、核心配置单元：调用 (Call)

调用 (`call`) 是性能调节的核心单元，Scene 自上而下逐级匹配并执行。

### 2.1 基础写入操作
- **直接写入数值**:
    ```json
    [“/proc/sys/kernel/sched_boost”, “1”]
    ```
- **写入后设为只读** (防止被覆盖): 在值前加 `#`。
    ```json
    [“/proc/sys/kernel/sched_boost”, “#1”]
    ```

### 2.2 内置频率调节函数
Scene 提供了跨平台兼容的便捷函数。

| 函数 | 格式 | 示例 | 说明 |
| :--- | :--- | :--- | :--- |
| **CPU频率范围** `@cpu_freq` | `@cpu_freq [cluster] [minFreq] [maxFreq]` | `[“@cpu_freq”, “cpu0”, “min”, “900MHz”]` | 同时设定集群的最小和最大频率。 |
| **CPU最小频率** `@cpu_freq_min` | `@cpu_freq_min [cluster] [minFreq]` | `[“@cpu_freq_min”, “cpu0”, “300MHz”]` | 仅设定最小频率。 |
| **CPU最大频率** `@cpu_freq_max` | `@cpu_freq_max [cluster] [maxFreq]` | `[“@cpu_freq_max”, “cpu0”, “900MHz”]` | 仅设定最大频率。 |
| **GPU频率范围** `@gpu_freq` | `@gpu_freq [minFreq] [maxFreq]` | `[“@gpu_freq”, “min”, “500MHz”]` | 设定GPU频率范围。 |
| **GPU最小频率** `@gpu_freq_min` | `@gpu_freq_min [minFreq]` | `[“@gpu_freq_min”, “400MHz”]` | 设定GPU最小频率。 |
| **GPU最大频率** `@gpu_freq_max` | `@gpu_freq_max [maxFreq]` | `[“@gpu_freq_max”, “300MHz”]` | 设定GPU最大频率。 |

**关键参数说明**：
- **`clusterExpr` (CPU集群标识)**: 可以使用 `cpu0`、`policy0`、`cluster0` 等格式，避免使用意义不明的纯数字。
- **`freqExpr` (频率表达式)**:
    - 特殊值：`min`, `max` 表示该集群支持的最小/最大频率。
    - 格式：`1800MHz`、`1.8GHz`、`1800000` 均被支持。
    - **注意**：使用 `GHz/MHz` 时需确保频率值完全匹配内核支持的离散频率点（例如 `2841600` 不等于 `2.8GHz`）。
    - **负值频率**：表示在 `max` 基础上减去指定值。例如集群最高 1800MHz，`-300MHz` 表示 1500MHz。

### 2.3 别名 (Alias)
别名是对系统路径的简写，用于提高配置可读性。
- **使用内置别名**: 通过 `$` 符号引用。
    ```json
    {
      “schemes”: {
        “powersave”: {
          “call”: [
            [“$sched_boost”, “1”] // $sched_boost 对应 /proc/sys/kernel/sched_boost
          ]
        }
      }
    }
    ```
- **自定义别名**: 在 `profile.json` 的 `”alias”` 字段中定义，优先级高于内置别名。
    ```json
    {
      “alias”: {
        “my_max_cpus”: “/sys/devices/system/cpu/cpu3/core_ctl/max_cpus”
      },
      “schemes”: {
        “powersave”: {
          “call”: [
            [“$my_max_cpus”, “4”]
          ]
        }
      }
    }
    ```

### 2.4 预设 (`@preset`) 与替换值 (`@values`)
用于复用公共配置集。
- **`@preset`**: 引用在 `”presets”` 字段中定义的指令集。
    ```json
    {
      “presets”: {
        “set_001”: [
          [“$cpufreq”, “0 450000 2000000”],
          [“@uclamp”, “0.00~max”, “0.00~max”, “0.1~max”]
        ]
      },
      “schemes”: {
        “powersave”: { “call”: [[“@preset”, “set_001”]] },
        “balance”: { “call”: [[“@preset”, “set_001”]] }
      }
    }
    ```
- **`@values`**: 增强版预设，允许传入动态值替换预设中的占位符。
    ```json
    {
      “presets”: {
        “min_freq”: [
          [“/sys/…/policy0/scaling_min_freq”], // 占位符1
          [“/sys/…/policy4/scaling_min_freq”]  // 占位符2
        ]
      },
      “schemes”: {
        “powersave”: {
          “call”: [
            [“@values”, “min_freq”, “300000”, “500000”] // 为占位符1，2赋值
          ]
        }
      }
    }
    ```

## 三、场景化配置 (Apps & Games)

Scene 允许针对不同应用或游戏（统称“场景”）进行独立配置。

### 3.1 基础场景配置
配置位于 `profile.json` 的 `”apps”` 和 `”games”` 数组中。Scene 会根据应用是否包含游戏引擎、横屏启动等特征自动分类。
```json
{
  “schemes”: {…},
  “apps”: [
    {
      “friendly”: “即时通讯”, // 备注，改善可读性
      “packages”: [“com.tencent.mm”, “com.tencent.mobileqq”],
      “call”: [] // 对此类应用的配置
    },
    {
      “friendly”: “所有APP”,
      “packages”: [“*”], // 通配符，必须放在最后一组
      “call”: []
    }
  ],
  “games”: […]
}
```

### 3.2 模式细分 (`modes`)
在每个场景下，可以进一步针对不同的性能档位（模式）进行配置。
- `call`, `state`, `sensors` 等配置支持在 `modes` 中覆盖上级设定。
- `mode` 字段也支持通配符 `[“*”]`。
```json
{
  “friendly”: “原神”,
  “packages”: [“com.miHoYo.Yuanshen”],
  “call”: [], // 默认配置
  “modes”: [
    {
      “mode”: [“powersave”, “balance”], // 命中省电和均衡模式
      “call”: [] // 对此两种模式的特定配置
    },
    {
      “mode”: [“*”], // 匹配所有其他模式
      “call”: []
    }
  ]
}
```

### 3.3 使用类目 (Categories)
类目是预定义的应用包名集合，可在 `packages` 中直接引用，如 `”IM”`、`”Reader”`。
```json
{
  “apps”: [
    {
      “friendly”: “即时通讯、阅读”,
      “packages”: [“IM”, “Reader”], // 引用类目
      “call”: […]
    }
  ]
}
```
类目定义参考 `categories.md`，包含 `ShortVideo`（短视频）、`Video`（视频）、`IM`（社交）、`Music`（音乐）、`Reader`（阅读）、`Launcher`（桌面）等。

### 3.4 配置拆分 (`import`)
为避免 `profile.json` 过大，可将某个场景的配置拆分到独立文件，通过 `”import”` 关联。
```json
// profile.json
{
  “apps”: [
    {
      “friendly”: “所有APP”,
      “packages”: [“*”],
      “import”: “Apps.json”
    }
  ]
}
```
```json
// Apps.json
{
  “call”: [],
  “modes”: […]
}
```

## 四、高级特性与模块

### 4.1 交互状态 (`state`)
根据用户是否在与设备交互（`active`/`inactive`）来切换配置，兼顾体验与静置节能。
```json
{
  “state”: {
    “active”: [
      [“@gpu_freq_min”, “0.4GHz”]
    ],
    “inactive”: [
      [“@gpu_freq_min”, “0.2GHz”]
    ]
  }
}
```

### 4.2 传感器 (`sensors`)
轮询特定路径或虚拟传感器的数值，并在不同阈值范围内触发配置调整。
- **虚拟传感器**: `cpu`(温度)、`gpu`(温度)、`soc`(CPU/GPU最高温)、`fps`(屏幕刷新帧率)、`battery`(电池温度)、`capacity`(电量百分比)。
- **基础写法**: 每个规则独立定义 `enter`（每次命中执行）或 `enter_once`（仅首次命中执行）操作。
- **改进写法**: 使用 `props` 和 `values` 对应修改多个属性，更简洁。
```json
{
  “sensor”: “fps”, // 使用虚拟传感器：屏幕帧率
  “interval”: 2000, // 轮询间隔2秒
  “props”: [“$gpu_freq”, “$cpu_max_7”], // 要修改的属性
  “rules”: [
    { “threshold”: [-1, 70], “values”: [“3200000000”, “1800000”] }, // fps < 70
    { “threshold”: [70, -1], “values”: [“4266000000”, “2300000”] }  // fps >= 70
  ]
}
```

### 4.3 核心分配 (`cpuset`)
主动为应用的关键线程分配CPU核心，以优化性能或功耗。
- **配置于 `threads.json`**。
- **针对游戏 (`cpuset`)**: 精细控制 `UnityMain`、`heavy_thread`（重负载线程）等。
- **针对普通应用 (`app_cpuset`)**: 区分 `main`（主线程）、`render`（渲染线程）、`other`（其他线程），通常在交互时迁移到大核。
- **实验性参数**: `ni` (设置线程nice值为-10)、`rr` (设置调度策略为SCHED_RR)，需谨慎使用。
```json
// threads.json - 游戏示例
[
  {
    “friendly”: “原神”,
    “categories”: [“GenshinImpact”],
    “cpuset”: {
      “unity_main”: “7”,
      “heavy_thread”: “UnityGfx”,
      “heavy_cores”: “4-6”,
      “comm”: { // 为指定线程分配核心
        “4-6”: [“UnityMultiRende”],
        “0-3”: [“AudioTrack”]
      },
      “other”: “0-6”
    }
  }
]
```

### 4.4 Scene FAS (Frame Adaptive Scheduling)
基于帧间隔的自适应性能调节，仅适用于游戏，旨在降低能耗。
- **原理**: 根据游戏丢帧（升频）或过于流畅（降频）动态调整CPU频率。
- **生效标志**: CPU整体频率下降、利用率提高、帧率无显著损失、功耗降低。
- **配置**:
    ```json
    {
      “friendly”: “和平精英”,
      “packages”: [“com.tencent.tmgp.pubgmhd”],
      “modes”: [
        {
          “mode”: [“balance”],
          “fas”: {
            “mode”: “normal”, // 模式：energy(省电)/normal(平衡)/fps(帧率优先)/boost(激进)
            “governor”: “schedutil”, // 配合的CPU调速器
            “freq”: [“2100000”, “2100000”] // [大核最大频率， 中核最大频率]
            // 进阶参数: big_min_freq, middle_min_freq, middle_optimum_freq等
          }
        }
      ]
    }
    ```

### 4.5 辅助调速器 (`limiter`)
用于辅助或替代系统调速器，更精确地控制CPU频率余量，解决默认调速器过于激进或保守的问题。
- **配置位置**: `profile.json` 的 `”features”` -> `”limiter”`。
- **启用**: 在 `call` 中使用 `[“@limiter”, “分组ID”]`。关闭使用 `[“@limiter”, “NONE”]`。
- **核心概念**:
    - **工作模式 (`mode`)**: `upper`(调整频率上限)、`bottom`(调整频率下限)、`performance`(切换为performance调速器并工作于upper模式)、`boost`(类似bottom，使用Hw Cycles统计负载)。
    - **固定余量 (`margin`)**: 与百分比余量不同，固定余量（单位：M Cycles）能在低频时更激进，高频时更保守，自带高频抑制效果。
    - **目标余量 (`margins`)**: 支持分频段设置不同余量，如 `”400 2100000:300 2650000:200″`。
    - **频率平滑度 (`smoothness`)**: 延缓降频过程，使频率更平稳，默认4。
    - **偏好 (`prefer`)**: 与平滑度配合，1(省电，无延迟)、2(平衡，使用平均负载)、3(性能，使用最高负载)。
    - **多核负载权重 (`mt`)**: 计算负载时，混合单核最高负载与多核平均负载的比例。
    - **排除核心 (`excludes`)**: 负载计算时排除指定的核心（例如专用于后台任务的核心）。

```json
// profile.json 示例
{
  “features”: {
    “limiter”: {
      “ddr_boost”: true, // 附带提升DDR频率
      “l3_boost”: true,  // 附带提升L3缓存频率
      “params”: {
        “p1”: {
          “mode”: “upper”,
          “cpus”: [
            { “max”: 1555200, “min”: 691200, “margin”: 250 }, // cluster0
            { “max”: 2112000, “min”: 768000, “margin”: 270 }, // cluster1
            { “max”: 2246400, “min”: 1171200, “margin”: 250 } // cluster2
          ]
        }
      }
    }
  },
  “schemes”: {
    “balance”: {
      “call”: [
        [“@limiter”, “p1”] // 启用limiter配置p1
      ]
    }
  }
}
```

### 4.6 其他特性 (`features`)
- **手势BOOST**: 为边缘滑动等手势触发短时性能提升，以避免动画卡顿。
    ```json
    {
      “features”: {
        “gesture_boost”: {
          “enter”: [[“/sys/kernel/ged/hal/custom_boost_gpu_freq”, “24”]], // 触发时
          “exit”: [[“/sys/kernel/ged/hal/custom_boost_gpu_freq”, “99”]]   // 结束时
        }
      }
    }
    ```
- **刷新率管理**、**旁路供电**等功能由用户在Scene GUI中配置，无需在方案中预设。

## 五、其他函数与配置

### 5.1 常用其他函数
| 函数 | 说明 | 示例 |
| :--- | :--- | :--- |
| `@msm_reset` / `@mtk_reset` | 重置高通/联发科性能锁定参数，常用于模式切换的首个操作。 | `[“@msm_reset”]` |
| `@thermal_threshold` | 修改CPU/GPU温度墙（合理范围95000~100000，即95-100°C）。 | `[“@thermal_threshold”, “98000”]` |
| `@mtk_renew` | 重置天玑处理器参数权限，避免PowerHAL报错增加功耗，建议在standby时调用。 | `[“@mtk_renew”]` |
| `@sched_limit` | 批量修改schedutil等调速器的升/降频延迟 (`up/down_rate_limit_us`)。 | `[“@sched_limit”, “0 1000”, “0 3000”, “0 2000”]` |
| `@uclamp` | 设置Utilization Clamping参数（需内核支持）。 | `[“@uclamp”, “0.00~max”, “0.00~max”, “0.1~max”]` |
| `@governor` | 切换或优选CPU调速器（Scene 7.0+）。 | `[“@governor”, “walt”, “schedutil”]` |

### 5.2 静态配置文件 (`.conf`)
这些文件放置在配置目录中，用于特定功能。
- **`DDR_MAPPING.CONF`**: 定义CPU频率与DDR频率的映射关系，用于辅助调速器、FAS等特性拉升内存频率（主要用于天玑平台）。
    ```conf
    APP   2600:6370 1800:5460 1500:4212 900:2067 0:800
    GAME  2800:8528 2600:7488 2400:6370 2000:5460 1400:4212 0:2067
    ```
- **`FAS_OFFSET.CONF`**: 设定FAS在特定游戏中，中核与大核的频率比例。
    ```conf
    com.tencent.tmgp.sgame=0.6
    ```
- **`FPS_LIMIT.CONF`**: 对特定游戏进行锁帧（仅支持整除当前屏幕刷新率的帧率）。
    ```conf
    com.kurogame.mingchao=40,45,48
    ```

### 5.3 过时的函数
如 `@set_priority`, `@set_value` 等，因过于复杂或不实用，已不推荐使用。

## 六、配置方案类型对比 (HP/EP/LP)

Scene 可能为同一处理器提供多种配置取向：
- **HP (High Performance)**: **性能与能效平衡**。日常应用限制峰值频率，使用辅助调速器；游戏中避免激进升频，可选FAS。
- **EP (Extreme Performance)**: **极致性能释放**。日常提高大核积极性；游戏中去除限制，积极升频，辅助提升DDR/L3频率。
- **LP (Low-Power)**: **极限节能**。日常大幅限制频率，使用辅助调速器，低负载时孤立核心；默认为所有游戏启用FAS，以帧率和响应速度为代价换取功耗控制。

---
**重要提示**：文档中所有示例代码仅用于展示框架功能，并非性能优化最佳实践。配置时请充分理解参数含义并根据具体设备调整。
    “reboot”: false,   // 切换后是否需要重启
    “fas”: false       // 是否支持FAS
  }
}
- 外部配置 (
"powercfg.json"): 用于安装到 
"/data" 目录的配置，额外包含 
"files"（相关文件路径）和 
"module"（相关Magisk模块ID）字段，以便在Scene中切换配置源时清理文件。

二、核心配置单元：调用 (Call)

调用 (
"call") 是性能调节的核心单元，Scene 自上而下逐级匹配并执行。

2.1 基础写入操作

- 直接写入数值:
[“/proc/sys/kernel/sched_boost”, “1”]
- 写入后设为只读 (防止被覆盖): 在值前加 
"#"。
[“/proc/sys/kernel/sched_boost”, “#1”]

2.2 内置频率调节函数

Scene 提供了跨平台兼容的便捷函数。

函数 格式 示例 说明
CPU频率范围 
"@cpu_freq" 
"@cpu_freq [cluster] [minFreq] [maxFreq]" 
"[“@cpu_freq”, “cpu0”, “min”, “900MHz”]" 同时设定集群的最小和最大频率。
CPU最小频率 
"@cpu_freq_min" 
"@cpu_freq_min [cluster] [minFreq]" 
"[“@cpu_freq_min”, “cpu0”, “300MHz”]" 仅设定最小频率。
CPU最大频率 
"@cpu_freq_max" 
"@cpu_freq_max [cluster] [maxFreq]" 
"[“@cpu_freq_max”, “cpu0”, “900MHz”]" 仅设定最大频率。
GPU频率范围 
"@gpu_freq" 
"@gpu_freq [minFreq] [maxFreq]" 
"[“@gpu_freq”, “min”, “500MHz”]" 设定GPU频率范围。
GPU最小频率 
"@gpu_freq_min" 
"@gpu_freq_min [minFreq]" 
"[“@gpu_freq_min”, “400MHz”]" 设定GPU最小频率。
GPU最大频率 
"@gpu_freq_max" 
"@gpu_freq_max [maxFreq]" 
"[“@gpu_freq_max”, “300MHz”]" 设定GPU最大频率。

关键参数说明：

- 
"clusterExpr" (CPU集群标识): 可以使用 
"cpu0"、
"policy0"、
"cluster0" 等格式，避免使用意义不明的纯数字。
- 
"freqExpr" (频率表达式):
   - 特殊值：
"min", 
"max" 表示该集群支持的最小/最大频率。
   - 格式：
"1800MHz"、
"1.8GHz"、
"1800000" 均被支持。
   - 注意：使用 
"GHz/MHz" 时需确保频率值完全匹配内核支持的离散频率点（例如 
"2841600" 不等于 
"2.8GHz"）。
   - 负值频率：表示在 
"max" 基础上减去指定值。例如集群最高 1800MHz，
"-300MHz" 表示 1500MHz。

2.3 别名 (Alias)

别名是对系统路径的简写，用于提高配置可读性。

- 使用内置别名: 通过 
"$" 符号引用。
{
  “schemes”: {
    “powersave”: {
      “call”: [
        [“$sched_boost”, “1”] // $sched_boost 对应 /proc/sys/kernel/sched_boost
      ]
    }
  }
}
- 自定义别名: 在 
"profile.json" 的 
"”alias”" 字段中定义，优先级高于内置别名。
{
  “alias”: {
    “my_max_cpus”: “/sys/devices/system/cpu/cpu3/core_ctl/max_cpus”
  },
  “schemes”: {
    “powersave”: {
      “call”: [
        [“$my_max_cpus”, “4”]
      ]
    }
  }
}

2.4 预设 (
"@preset") 与替换值 (
"@values")

用于复用公共配置集。

- 
"@preset": 引用在 
"”presets”" 字段中定义的指令集。
{
  “presets”: {
    “set_001”: [
      [“$cpufreq”, “0 450000 2000000”],
      [“@uclamp”, “0.00~max”, “0.00~max”, “0.1~max”]
    ]
  },
  “schemes”: {
    “powersave”: { “call”: [[“@preset”, “set_001”]] },
    “balance”: { “call”: [[“@preset”, “set_001”]] }
  }
}
- 
"@values": 增强版预设，允许传入动态值替换预设中的占位符。
{
  “presets”: {
    “min_freq”: [
      [“/sys/…/policy0/scaling_min_freq”], // 占位符1
      [“/sys/…/policy4/scaling_min_freq”]  // 占位符2
    ]
  },
  “schemes”: {
    “powersave”: {
      “call”: [
        [“@values”, “min_freq”, “300000”, “500000”] // 为占位符1，2赋值
      ]
    }
  }
}

三、场景化配置 (Apps & Games)

Scene 允许针对不同应用或游戏（统称“场景”）进行独立配置。

3.1 基础场景配置

配置位于 
"profile.json" 的 
"”apps”" 和 
"”games”" 数组中。Scene 会根据应用是否包含游戏引擎、横屏启动等特征自动分类。

{
  “schemes”: {…},
  “apps”: [
    {
      “friendly”: “即时通讯”, // 备注，改善可读性
      “packages”: [“com.tencent.mm”, “com.tencent.mobileqq”],
      “call”: [] // 对此类应用的配置
    },
    {
      “friendly”: “所有APP”,
      “packages”: [“*”], // 通配符，必须放在最后一组
      “call”: []
    }
  ],
  “games”: […]
}

3.2 模式细分 (
"modes")

在每个场景下，可以进一步针对不同的性能档位（模式）进行配置。

- 
"call", 
"state", 
"sensors" 等配置支持在 
"modes" 中覆盖上级设定。
- 
"mode" 字段也支持通配符 
"[“*”]"。

{
  “friendly”: “原神”,
  “packages”: [“com.miHoYo.Yuanshen”],
  “call”: [], // 默认配置
  “modes”: [
    {
      “mode”: [“powersave”, “balance”], // 命中省电和均衡模式
      “call”: [] // 对此两种模式的特定配置
    },
    {
      “mode”: [“*”], // 匹配所有其他模式
      “call”: []
    }
  ]
}

3.3 使用类目 (Categories)

类目是预定义的应用包名集合，可在 
"packages" 中直接引用，如 
"”IM”"、
"”Reader”"。

{
  “apps”: [
    {
      “friendly”: “即时通讯、阅读”,
      “packages”: [“IM”, “Reader”], // 引用类目
      “call”: […]
    }
  ]
}

类目定义参考 
"categories.md"，包含 
"ShortVideo"（短视频）、
"Video"（视频）、
"IM"（社交）、
"Music"（音乐）、
"Reader"（阅读）、
"Launcher"（桌面）等。

3.4 配置拆分 (
"import")

为避免 
"profile.json" 过大，可将某个场景的配置拆分到独立文件，通过 
"”import”" 关联。

// profile.json
{
  “apps”: [
    {
      “friendly”: “所有APP”,
      “packages”: [“*”],
      “import”: “Apps.json”
    }
  ]
}

// Apps.json
{
  “call”: [],
  “modes”: […]
}

四、高级特性与模块

4.1 交互状态 (
"state")

根据用户是否在与设备交互（
"active"/
"inactive"）来切换配置，兼顾体验与静置节能。

{
  “state”: {
    “active”: [
      [“@gpu_freq_min”, “0.4GHz”]
    ],
    “inactive”: [
      [“@gpu_freq_min”, “0.2GHz”]
    ]
  }
}

4.2 传感器 (
"sensors")

轮询特定路径或虚拟传感器的数值，并在不同阈值范围内触发配置调整。

- 虚拟传感器: 
"cpu"(温度)、
"gpu"(温度)、
"soc"(CPU/GPU最高温)、
"fps"(屏幕刷新帧率)、
"battery"(电池温度)、
"capacity"(电量百分比)。
- 基础写法: 每个规则独立定义 
"enter"（每次命中执行）或 
"enter_once"（仅首次命中执行）操作。
- 改进写法: 使用 
"props" 和 
"values" 对应修改多个属性，更简洁。

{
  “sensor”: “fps”, // 使用虚拟传感器：屏幕帧率
  “interval”: 2000, // 轮询间隔2秒
  “props”: [“$gpu_freq”, “$cpu_max_7”], // 要修改的属性
  “rules”: [
    { “threshold”: [-1, 70], “values”: [“3200000000”, “1800000”] }, // fps < 70
    { “threshold”: [70, -1], “values”: [“4266000000”, “2300000”] }  // fps >= 70
  ]
}

4.3 核心分配 (
"cpuset")

主动为应用的关键线程分配CPU核心，以优化性能或功耗。

- 配置于 
"threads.json"。
- 针对游戏 (
"cpuset"): 精细控制 
"UnityMain"、
"heavy_thread"（重负载线程）等。
- 针对普通应用 (
"app_cpuset"): 区分 
"main"（主线程）、
"render"（渲染线程）、
"other"（其他线程），通常在交互时迁移到大核。
- 实验性参数: 
"ni" (设置线程nice值为-10)、
"rr" (设置调度策略为SCHED_RR)，需谨慎使用。

// threads.json - 游戏示例
[
  {
    “friendly”: “原神”,
    “categories”: [“GenshinImpact”],
    “cpuset”: {
      “unity_main”: “7”,
      “heavy_thread”: “UnityGfx”,
      “heavy_cores”: “4-6”,
      “comm”: { // 为指定线程分配核心
        “4-6”: [“UnityMultiRende”],
        “0-3”: [“AudioTrack”]
      },
      “other”: “0-6”
    }
  }
]

4.4 Scene FAS (Frame Adaptive Scheduling)

基于帧间隔的自适应性能调节，仅适用于游戏，旨在降低能耗。

- 原理: 根据游戏丢帧（升频）或过于流畅（降频）动态调整CPU频率。
- 生效标志: CPU整体频率下降、利用率提高、帧率无显著损失、功耗降低。
- 配置:
{
  “friendly”: “和平精英”,
  “packages”: [“com.tencent.tmgp.pubgmhd”],
  “modes”: [
    {
      “mode”: [“balance”],
      “fas”: {
        “mode”: “normal”, // 模式：energy(省电)/normal(平衡)/fps(帧率优先)/boost(激进)
        “governor”: “schedutil”, // 配合的CPU调速器
        “freq”: [“2100000”, “2100000”] // [大核最大频率， 中核最大频率]
        // 进阶参数: big_min_freq, middle_min_freq, middle_optimum_freq等
      }
    }
  ]
}

4.5 辅助调速器 (
"limiter")

用于辅助或替代系统调速器，更精确地控制CPU频率余量，解决默认调速器过于激进或保守的问题。

- 配置位置: 
"profile.json" 的 
"”features”" -> 
"”limiter”"。
- 启用: 在 
"call" 中使用 
"[“@limiter”, “分组ID”]"。关闭使用 
"[“@limiter”, “NONE”]"。
- 核心概念:
   - 工作模式 (
"mode"): 
"upper"(调整频率上限)、
"bottom"(调整频率下限)、
"performance"(切换为performance调速器并工作于upper模式)、
"boost"(类似bottom，使用Hw Cycles统计负载)。
   - 固定余量 (
"margin"): 与百分比余量不同，固定余量（单位：M Cycles）能在低频时更激进，高频时更保守，自带高频抑制效果。
   - 目标余量 (
"margins"): 支持分频段设置不同余量，如 
"”400 2100000:300 2650000:200″"。
   - 频率平滑度 (
"smoothness"): 延缓降频过程，使频率更平稳，默认4。
   - 偏好 (
"prefer"): 与平滑度配合，1(省电，无延迟)、2(平衡，使用平均负载)、3(性能，使用最高负载)。
   - 多核负载权重 (
"mt"): 计算负载时，混合单核最高负载与多核平均负载的比例。
   - 排除核心 (
"excludes"): 负载计算时排除指定的核心（例如专用于后台任务的核心）。

// profile.json 示例
{
  “features”: {
    “limiter”: {
      “ddr_boost”: true, // 附带提升DDR频率
      “l3_boost”: true,  // 附带提升L3缓存频率
      “params”: {
        “p1”: {
          “mode”: “upper”,
          “cpus”: [
            { “max”: 1555200, “min”: 691200, “margin”: 250 }, // cluster0
            { “max”: 2112000, “min”: 768000, “margin”: 270 }, // cluster1
            { “max”: 2246400, “min”: 1171200, “margin”: 250 } // cluster2
          ]
        }
      }
    }
  },
  “schemes”: {
    “balance”: {
      “call”: [
        [“@limiter”, “p1”] // 启用limiter配置p1
      ]
    }
  }
}

4.6 其他特性 (
"features")

- 手势BOOST: 为边缘滑动等手势触发短时性能提升，以避免动画卡顿。
{
  “features”: {
    “gesture_boost”: {
      “enter”: [[“/sys/kernel/ged/hal/custom_boost_gpu_freq”, “24”]], // 触发时
      “exit”: [[“/sys/kernel/ged/hal/custom_boost_gpu_freq”, “99”]]   // 结束时
    }
  }
}
- 刷新率管理、旁路供电等功能由用户在Scene GUI中配置，无需在方案中预设。

五、其他函数与配置

5.1 常用其他函数

函数 说明 示例

"@msm_reset" / 
"@mtk_reset" 重置高通/联发科性能锁定参数，常用于模式切换的首个操作。 
"[“@msm_reset”]"

"@thermal_threshold" 修改CPU/GPU温度墙（合理范围95000~100000，即95-100°C）。 
"[“@thermal_threshold”, “98000”]"

"@mtk_renew" 重置天玑处理器参数权限，避免PowerHAL报错增加功耗，建议在standby时调用。 
"[“@mtk_renew”]"

"@sched_limit" 批量修改schedutil等调速器的升/降频延迟 (
"up/down_rate_limit_us")。 
"[“@sched_limit”, “0 1000”, “0 3000”, “0 2000”]"

"@uclamp" 设置Utilization Clamping参数（需内核支持）。 
"[“@uclamp”, “0.00~max”, “0.00~max”, “0.1~max”]"

"@governor" 切换或优选CPU调速器（Scene 7.0+）。 
"[“@governor”, “walt”, “schedutil”]"

5.2 静态配置文件 (
".conf")

这些文件放置在配置目录中，用于特定功能。

- 
"DDR_MAPPING.CONF": 定义CPU频率与DDR频率的映射关系，用于辅助调速器、FAS等特性拉升内存频率（主要用于天玑平台）。
APP   2600:6370 1800:5460 1500:4212 900:2067 0:800
GAME  2800:8528 2600:7488 2400:6370 2000:5460 1400:4212 0:2067
- 
"FAS_OFFSET.CONF": 设定FAS在特定游戏中，中核与大核的频率比例。
com.tencent.tmgp.sgame=0.6
- 
"FPS_LIMIT.CONF": 对特定游戏进行锁帧（仅支持整除当前屏幕刷新率的帧率）。
com.kurogame.mingchao=40,45,48

5.3 过时的函数

如 
"@set_priority", 
"@set_value" 等，因过于复杂或不实用，已不推荐使用。

六、配置方案类型对比 (HP/EP/LP)

Scene 可能为同一处理器提供多种配置取向：

- HP (High Performance): 性能与能效平衡。日常应用限制峰值频率，使用辅助调速器；游戏中避免激进升频，可选FAS。
- EP (Extreme Performance): 极致性能释放。日常提高大核积极性；游戏中去除限制，积极升频，辅助提升DDR/L3频率。
- LP (Low-Power): 极限节能。日常大幅限制频率，使用辅助调速器，低负载时孤立核心；默认为所有游戏启用FAS，以帧率和响应速度为代价换取功耗控制。

重要提示：文档中所有示例代码仅用于展示框架功能，并非性能优化最佳实践。配置时请充分理解参数含义并根据具体设备调整。
