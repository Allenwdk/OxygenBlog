// 关于页配置
//
// 页面内容全部由本文件驱动，改这里即可，不需要动组件。
//
// ⚠️ 标注 TODO 的条目是移植时留下的占位数据，请替换成你自己的内容。
// 图片路径以 / 开头时相对 public 目录；找不到文件会显示不出来，记得放图。

// ===== 页头 =====
export const BeforeAnimationText = '持续 '; // 在动画字前面的字
export const AnimationText = '进步'; // 动画字

// ===== 个人信息 =====
const AVATAR_FILENAME = 'touxiang.jpg'; // 头像文件名，需放在 public 目录下
// 处理头像路径的函数（无需修改）
export const getAvatarPath = (): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return basePath ? `${basePath}/${AVATAR_FILENAME}` : `/${AVATAR_FILENAME}`;
};
export const isBorder = true; // 控制头像边框是否显示
export const name = 'Allen'; // 名字
export const slogan = '在技术的海洋中探索，在代码的世界里创造，用文字记录成长的足迹'; // 个人宣言

// 随机宣言：点击名字/宣言区域会从下面这个列表里随机切换
export const slogans: string[] = [
  '在技术的海洋中探索，在代码的世界里创造，用文字记录成长的足迹',
  // TODO：换成你自己的宣言
  'Keep hungry, keep foolish.',
];

// ===== 关于我 / 关于本站 / 关于域名 =====
// 页面按 id 映射图标：about-me → User、about-site → Globe、about-domain → Link2
// 因此三个 id 请保持不变
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
    // TODO：换成你自己的照片，放到 public/aboutme/ 下
    coverImage: '/assets/act1.png',
    paragraphs: [
      // TODO：替换成自我介绍
      '天津理工大学计算机科学与技术专业就读，2029 年毕业。',
      '热爱技术，热爱生活，希望自己能创造更多价值。',
    ],
  },
  {
    id: 'about-site',
    title: '关于本站',
    coverImage: '/assets/act2.png',
    paragraphs: [
      // TODO：替换成建站故事
      '本站基于开源的 OxygenBlogPlatform 模板搭建，使用 Next.js 静态导出后部署在 GitHub Pages 上。',
      '后来陆续加上了动态、评论区、画廊、更新日志等模块。',
    ],
    footer: '关于本站的故事未完待续……',
  },
  {
    id: 'about-domain',
    title: '关于域名',
    coverImage: '/touxiang.jpg',
    paragraphs: [
      // TODO：替换成域名/昵称的由来
      '站点通过自定义域名发布，构建时不再附加仓库路径前缀。',
    ],
  },
];

// ===== MBTI =====
export interface MBTIConfig {
  type: string; // MBTI 四字母类型，例如 'INTP'
  color: string; // 卡片主题色，用于高亮和装饰
}

export const mbti: MBTIConfig = {
  // TODO：换成你自己的 MBTI 与主题色
  type: 'INTP',
  color: '#66ccff',
};

// ===== 歌单 =====
export interface MusicPlaylistConfig {
  name: string; // 歌单名称
  description: string; // 歌单简介
  coverImage: string; // 封面图片路径，相对于 public 目录
  url: string; // 外部歌单链接
  buttonText: string; // 跳转按钮文案
}

export const musicPlaylist: MusicPlaylistConfig = {
  // TODO：换成你自己的歌单
  name: '我喜欢的音乐',
  description: '随便听听',
  coverImage: '/assets/act1.png',
  url: 'https://music.163.com/',
  buttonText: '去听歌',
};

// ===== 兴趣爱好 =====
// icon 必须是页面 iconMap 里已有的键：
// User | Globe | Link | Music | Dribbble | CircleDot | Video | Box | Gamepad2 | Crown | Laptop | Keyboard | Mouse | Headphones
export interface HobbyConfig {
  name: string; // 兴趣名称
  icon: string; // Lucide 图标标识
}

export const hobbies: HobbyConfig[] = [
  // TODO：换成你自己的兴趣
  { name: '写代码', icon: 'Laptop' },
  { name: '听音乐', icon: 'Music' },
  { name: '打游戏', icon: 'Gamepad2' },
  { name: '瞎捣鼓', icon: 'Box' },
];

// ===== 游戏库 =====
export interface GameConfig {
  id: string; // 唯一标识
  name: string; // 游戏名称
  coverImage: string; // 封面图片路径，相对于 public 目录
  description: string; // 一句话简介或评价
  coverHorizontalPosition?: string; // 封面水平位置，默认居中
  coverVerticalPosition?: string; // 封面垂直位置，默认居中
  coverSize?: string; // 封面图片缩放比例，默认 '120%'
}

// 常玩游戏
export const frequentGames: GameConfig[] = [
  // TODO：换成你常玩的游戏与封面
  { id: 'tbd-1', name: '待补充', coverImage: '/assets/Actions.png', description: '常玩游戏占位数据' },
  { id: 'tbd-2', name: '待补充', coverImage: '/assets/Pages.png', description: '常玩游戏占位数据' },
  { id: 'tbd-3', name: '待补充', coverImage: '/assets/Settings.png', description: '常玩游戏占位数据' },
];

// 偶尔玩 / 已通关
export const occasionalGames: GameConfig[] = [
  // TODO：换成你偶尔玩的游戏与封面
  { id: 'tbo-1', name: '待补充', coverImage: '/assets/Fork.png', description: '偶尔玩玩游戏占位数据' },
  { id: 'tbo-2', name: '待补充', coverImage: '/assets/act1.png', description: '偶尔玩玩游戏占位数据' },
  { id: 'tbo-3', name: '待补充', coverImage: '/assets/act2.png', description: '偶尔玩玩游戏占位数据' },
];

// ===== 技能雷达 =====
export interface SkillRadarItem {
  /** 技能维度名称（会显示在雷达图轴上） */
  subject: string;
  /** 熟练度 0-100 */
  score: number;
  /** 简短描述，鼠标悬停 tooltip 时显示 */
  description?: string;
}

// TODO：换成你自己的技能维度与自评分（建议 20-95，避免全是 100 导致雷达图没有辨识度）
export const skillList: SkillRadarItem[] = [
  { subject: '前端', score: 75 },
  { subject: '后端', score: 60 },
  { subject: '算法', score: 55 },
  { subject: '数据库', score: 55 },
  { subject: 'Linux', score: 60 },
  { subject: '设计', score: 45 },
  { subject: '写作', score: 50 },
  { subject: '折腾', score: 85 },
];

export const skillEvaluation = '自评：还得练'; // 雷达图下方的一句话自评

// ===== 个人偏好 =====
export interface FavoriteSongItem {
  /** 排名序号（从 1 开始） */
  rank: number;
  /** 歌曲名称 */
  name: string;
  /** 歌手 / 调教师（可选） */
  artist?: string;
  /** 简短推荐语（可选） */
  description?: string;
  /** 外链地址（可选） */
  url?: string;
}

// TODO：换成你最喜欢的歌曲 Top 排行（建议 3-5 首）
export const favoriteSongs: FavoriteSongItem[] = [
  { rank: 1, name: '待补充', description: '占位数据' },
  { rank: 2, name: '待补充', description: '占位数据' },
  { rank: 3, name: '待补充', description: '占位数据' },
];

export interface FavoriteQuoteItem {
  /** 语录内容 */
  text: string;
  /** 出处（可选） */
  source?: string;
}

// TODO：换成你喜欢的语录
export const favoriteQuotes: FavoriteQuoteItem[] = [
  { text: 'Keep hungry, keep foolish.', source: '《Whole Earth Catalog》' },
  { text: '待补充', source: 'TODO' },
];

// ===== 设备 =====
// id 必须是页面 deviceIconMap 里已有的键：
// laptop | desktop | phone | tablet | keyboard | mouse | watch | headphones
export interface DeviceConfig {
  id: string; // 唯一标识
  name: string; // 设备名称
  backContent?: string[]; // 可选：背面显示的内容，每行一个配置项
}

// TODO：换成你自己的设备与配置
export const devices: DeviceConfig[] = [
  { id: 'laptop', name: '笔记本', backContent: ['待补充'] },
  { id: 'desktop', name: '台式机', backContent: ['待补充'] },
  { id: 'phone', name: '手机', backContent: ['待补充'] },
  { id: 'keyboard', name: '键盘', backContent: ['待补充'] },
  { id: 'mouse', name: '鼠标', backContent: ['待补充'] },
  { id: 'headphones', name: '耳机', backContent: ['待补充'] },
];

// ===== 旅行足迹 =====
export type TravelCategory = 'travel' | 'living' | 'want-to-go';

export interface TravelLocation {
  id: string;
  city: string;
  province?: string;
  date: string;
  coordinates: [number, number]; // [纬度, 经度]
  category: TravelCategory;
  description: string;
}

export const travelCategoryConfig: Record<TravelCategory, { label: string; color: string }> = {
  travel: { label: '旅游', color: '#22dfa3ff' },
  living: { label: '居住', color: '#66ccff' },
  'want-to-go': { label: '想去', color: '#eaff00ff' },
};

// TODO：换成你自己的足迹，coordinates 是 [纬度, 经度]
export const travelLocations: TravelLocation[] = [
  { id: 'tianjin', city: '天津', date: '2025', coordinates: [39.0842, 117.2009], category: 'living', description: '待补充' },
  { id: 'beijing', city: '北京', province: '北京', date: '2025', coordinates: [39.9042, 116.4074], category: 'travel', description: '待补充' },
  { id: 'shanghai', city: '上海', province: '上海', date: '2026', coordinates: [31.2304, 121.4737], category: 'want-to-go', description: '待补充' },
];

// ===== 追的番 =====
export interface AnimeConfig {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  status: string;
  link?: string; // 番剧链接，点击图片可跳转
  coverHorizontalPosition?: string;
  coverVerticalPosition?: string;
  coverSize?: string;
}

// TODO：换成你自己在追 / 看过的番与封面
export const animeList: AnimeConfig[] = [
  { id: 'tba-1', name: '待补充', coverImage: '/assets/Actions.png', description: '占位数据', status: '在看' },
  { id: 'tba-2', name: '待补充', coverImage: '/assets/Pages.png', description: '占位数据', status: '看完' },
  { id: 'tba-3', name: '待补充', coverImage: '/assets/Settings.png', description: '占位数据', status: '想看' },
];

// ===== 联系方式 =====
export const mail = '15620209105@163.com'; // 邮箱（页面点击图标可复制）
export const github = 'https://github.com/Allenwdk'; // GitHub
export const bilibili = 'https://space.bilibili.com/456299449'; // Bilibili
