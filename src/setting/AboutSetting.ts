// 导入路径工具函数，必须放在文件最顶部
import { processImagePath } from '../lib/process-image-path';

//主标题部分配置
export const title = "关于"; //主标题
export const BeforeAnimationText = "Keep "; //在动画字前面的字
export const AnimationText = "Going"; //动画字
export const isRainbowGradient = true; //控制 BeforeAnimationText 的颜色效果，观察是否开启彩虹渐变

//个人信息部分配置
const AVATAR_FILENAME = "touxiang.jpg"; //头像配置，头像需要放进public文件夹内，这里只写文件名和后缀

// 处理头像路径的函数
export const getAvatarPath = (): string => {
  // 使用工具函数处理路径
  return processImagePath(AVATAR_FILENAME);
};
export const isBorder = true; //控制头像边框是否显示
export const name = "Allen"; //名字
export const slogan =
  "在技术的海洋中探索，在代码的世界里创造，用文字记录成长的足迹"; //个人宣言

// 随机宣言配置
// 点击关于我页面名字/宣言区域时，会从这个列表中随机切换显示
export const slogans: string[] = [
  "在技术的海洋中探索，在代码世界里创造",
  "持续进步，不断突破自我边界",
  "用代码构建未来，用技术改变世界",
  "保持热爱，奔赴下一场山海",
  "在数字世界中寻找无限可能",
  "每一次敲击键盘，都是向梦想的靠近"
];

//https://simpleicons.org 图云的图标配置
const slugs = [
  "typescript",
  "javascript",
  "react",
  "Dart",
  "Flutter",
  "html5",
  "css",
  "C",
  "C++",
  "git",
  "github",
  "gitlab",
];
/*
  关于技术栈图云配置说明
1. 可以使用 https://simpleicons.org 提供的图标，图标名称需要与 slugs 中的名称一致
2. 如果想上传自定义图片，将image配置成自定义图片的url数组
*/

//simpleicons版本，如果你使用网站提供的图标，这里不用动
export const images = slugs.map(
  (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
);

//自定义图片版本，如果你使用自定义图片的话，将上面的代码注释掉，下面的代码解除注释，写法如下
/*
export const images = [
  "/avatar.jpg",
];
*/
// 关于我页面右侧各区块配置
// 将页面中的大段文字抽离到配置中，方便后续维护和内容修改
export interface AboutSectionConfig {
  id: string; // 区块唯一标识
  title: string; // 区块标题
  coverImage: string; // 手风琴面板封面图片路径
  coverHorizontalPosition?: string; // 封面水平位置，默认居中，例如 '40%'
  coverVerticalPosition?: string; // 封面垂直位置，默认居中，例如 '30%'
  coverSize?: string; // 封面图片缩放比例，默认 '120%'
  paragraphs: string[]; // 段落内容数组
  quote?: { // 可选：引用/比喻区块
    intro: string; // 引用前导语
    text: string; // 引用内容
  };
  footer?: string; // 可选：区块底部强调文字
}

export const aboutSections: AboutSectionConfig[] = [
  {
    id: 'about-me',
    title: '关于我',
    coverImage: '/aboutme/1.jpg',
    coverHorizontalPosition: '51%',
    coverVerticalPosition: '0%',
    coverSize: '100%',
    paragraphs: [
      '天津理工大学计算机科学与技术专业就读，预计2029年毕业。',
      '热爱技术，热爱生活，希望自己能创造更多价值'
    ],
    quote: {
      intro: '来个超绝比喻介绍一下自己：',
      text: '就像冬日清晨的桥梁，\n热爱就在桥的另一侧，\n明明有路，却总被雾笼罩着。\n至于无感的事物，\n就好似桥梁站在桥边，\n举目望去，\n唯有一片空白。'
    }
  },
  {
    id: 'about-site',
    title: '关于本站',
    coverImage: '/aboutme/3.jpeg',
    coverVerticalPosition: '60%',
    coverHorizontalPosition: '75%',
    coverSize: '100%',
    paragraphs: [
      '这是一个基于 Next.js 的静态博客平台，使用 TypeScript + React 19 + Tailwind CSS v4 技术栈构建。',
      '博客支持GitHub Pages静态部署，所有内容在构建时生成，保证极致的加载速度与安全性。'
    ],
    footer: '关于本站的故事未完待续。。。'
  },
  {
    id: 'about-domain',
    title: '关于域名',
    coverImage: '/aboutme/2.png',
    coverHorizontalPosition: '55%',
    coverVerticalPosition: '50%',
    coverSize: '140%',
    paragraphs: [
      '网站部署在GitHub Pages上，使用自定义域名访问。',
      '选择专业且易记的域名，提升博客的整体质感与专业性。'
    ]
  }
];

// MBTI 配置
// 展示个人 MBTI 类型和卡片主题色
export interface MBTIConfig {
  type: string; // MBTI 四字母类型，例如 'INTP'
  color: string; // 卡片主题色，用于高亮和装饰
}

export const mbti: MBTIConfig = {
  type: 'ESTJ',
  color: '#3b82f6',
};

// 个人歌单配置
// 用于在关于页面展示外部音乐平台歌单入口
export interface MusicPlaylistConfig {
  name: string; // 歌单名称
  description: string; // 歌单简介
  coverImage: string; // 封面图片路径，相对于 public 目录
  url: string; // 外部歌单链接
  buttonText: string; // 跳转按钮文案
}

export const musicPlaylist: MusicPlaylistConfig = {
  name: '技术分享与思考',
  description: '记录学习笔记与技术分享的歌单',
  coverImage: '/aboutme/musiclistcover/gexingsifang.jpg',
  url: 'https://music.163.com/',
  buttonText: '去听听',
};

// 兴趣爱好配置
// 每个兴趣关联一个Lucide图标标识，在页面中映射为具体图标组件
export interface HobbyConfig {
  name: string; // 兴趣名称
  icon: string; // Lucide图标标识
}

export const hobbies: HobbyConfig[] = [
  { name: '编程开发', icon: 'Box' },
  { name: '技术博客', icon: 'BookOpen' },
  { name: '开源贡献', icon: 'Code' },
  { name: '游戏娱乐', icon: 'Gamepad2' }
];

// 游戏库配置
// 用于在关于页面以手风琴形式展示个人游戏库
export interface GameConfig {
  id: string; // 唯一标识
  name: string; // 游戏名称
  coverImage: string; // 封面图片路径，相对于 public 目录
  description: string; // 一句话简介或评价
  coverHorizontalPosition?: string; // 封面水平位置，默认居中，例如 '40%'
  coverVerticalPosition?: string; // 封面垂直位置，默认居中，例如 '30%'
  coverSize?: string; // 封面图片缩放比例，默认 '120%'
}

// 常玩游戏
export const frequentGames: GameConfig[] = [
  {
    id: 'genshin',
    name: '原神',
    coverHorizontalPosition: '52%',
    coverVerticalPosition: '50%',
    coverSize: '120%',
    coverImage: '/aboutme/games/Genshinimpact.jpg',
    description: '原神，启动！',
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    coverHorizontalPosition: '25%',
    coverVerticalPosition: '50%',
    coverSize: '120%',
    coverImage: '/aboutme/games/Minecraft.jpg',
    description: '沙盒世界，无限创造',
  },
  {
    id: 'wutheringwaves',
    name: '鸣潮',
    coverHorizontalPosition: '50%',
    coverVerticalPosition: '50%',
    coverSize: '120%',
    coverImage: '/aboutme/games/WutheringWaves.jpg',
    description: '动作战斗，流畅丝滑',
  },
];

// 偶尔玩/通关
export const occasionalGames: GameConfig[] = [
  {
    id: 'phigros',
    name: 'Phigros',
    coverHorizontalPosition: '50%',
    coverVerticalPosition: '50%',
    coverSize: '120%',
    coverImage: '/aboutme/games/Phigros.jpg',
    description: '创新判定线，音游佳作',
  },
  {
    id: 'bangdream',
    name: "BanG Dream!",
    coverHorizontalPosition: '50%',
    coverVerticalPosition: '50%',
    coverSize: '120%',
    coverImage: '/aboutme/games/BanGDream.jpg',
    description: '少女乐团，节奏游戏',
  },
  {
    id: 'projectsekai',
    name: '世界计划',
    coverHorizontalPosition: '50%',
    coverVerticalPosition: '50%',
    coverSize: '120%',
    coverImage: '/aboutme/games/ProjectSekai.jpg',
    description: '初音未来，卡牌养成',
  },
  {
    id: 'honorofkings',
    name: '王者荣耀',
    coverHorizontalPosition: '50%',
    coverVerticalPosition: '50%',
    coverSize: '120%',
    coverImage: '/aboutme/games/HonorOfKings.jpg',
    description: 'MOBA 多人在线竞技',
  },
  {
    id: 'deltaforce',
    name: '三角洲行动',
    coverHorizontalPosition: '50%',
    coverVerticalPosition: '50%',
    coverSize: '120%',
    coverImage: '/aboutme/games/DeltaForce.jpg',
    description: '战术射击，团队作战',
  },
  {
    id: 'starrysky',
    name: '崩坏：星穹铁道',
    coverHorizontalPosition: '50%',
    coverVerticalPosition: '50%',
    coverSize: '120%',
    coverImage: '/aboutme/games/StarrySky.jpg',
    description: '回合制 RPG，星穹列车',
  },
  {
    id: 'valorant',
    name: '无畏契约',
    coverHorizontalPosition: '50%',
    coverVerticalPosition: '50%',
    coverSize: '120%',
    coverImage: '/aboutme/games/Valorant.jpg',
    description: '战术射击，5v5 对抗',
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克 2077',
    coverHorizontalPosition: '50%',
    coverVerticalPosition: '50%',
    coverSize: '120%',
    coverImage: '/aboutme/games/Cyberpunk2077.jpg',
    description: '开放世界 RPG，夜之城',
  },
];

//关于我页面一二三段（保留以兼容旧用法，建议后续使用 aboutSections 配置）
export const aboutMeP1 = "天津理工大学计算机科学与技术专业就读，2029年毕业 ";
export const aboutMeP2 = "热爱技术，热爱生活，希望自己能创造更多价值 ";
export const aboutMeP3 = "";

//联系我页面配置
export const mainContactMeDescription =
  "如果你对我的文章感兴趣，或者想要交流技术话题，欢迎与我联系！"; //联系我页面主描述
export const subContactMeDescription = "我会尽快回复你的消息 ✨"; //联系我页面补充描述
export const mail = "mailto:15620209105@163.com"; //邮箱配置
export const github = "https://github.com/Allenwdk"; //github网站配置
export const bilibili = "https://space.bilibili.com/456299449";

// 友链分类类型
export type FriendLinkCategory = 'developer' | 'designer' | 'blog' | 'other';

// 友链分类标签映射
export const friendCategoryLabels: Record<FriendLinkCategory, string> = {
  developer: '开发者',
  designer: '设计师',
  blog: '博客',
  other: '其他'
};

// 友链分类颜色映射
export const friendCategoryColors: Record<FriendLinkCategory, string> = {
  developer: '#3b82f6', // 蓝色
  designer: '#ec4899',  // 粉色
  blog: '#10b981',      // 绿色
  other: '#8b5cf6'      // 紫色
};

// 友链数据接口
export interface FriendLink {
  name: string;
  url: string;
  description: string;
  avatar?: string;
  category?: FriendLinkCategory;
  tags?: string[];
}

//友情链接配置
export const friendsLinks: FriendLink[] = [
];

// 相关链接分类定义
export type RelatedLinkCategory = 'framework' | 'tool' | 'ui' | 'tutorial' | 'project';

// 分类显示名称映射
export const categoryLabels: Record<RelatedLinkCategory, string> = {
  framework: '技术框架',
  tool: '开发工具',
  ui: 'UI组件',
  tutorial: '教程资源',
  project: '项目源码'
};

// 分类颜色映射
export const categoryColors: Record<RelatedLinkCategory, string> = {
  framework: '#3b82f6', // 蓝色
  tool: '#10b981',      // 绿色
  ui: '#8b5cf6',        // 紫色
  tutorial: '#f59e0b',  // 橙色
  project: '#ec4899'    // 粉色
};

// 相关链接配置
export interface RelatedLink {
  name: string;
  url: string;
  description: string;
  category: RelatedLinkCategory;
  icon?: string;
  tags?: string[];
}
