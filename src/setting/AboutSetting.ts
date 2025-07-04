export const title = "关于我"; //主标题
export const BeforeAnimationText = "持续 "; //在动画字前面的字
export const AnimationText = "进步"; //动画字
/**
 * 头像配置，自动处理basePath
 * 需要存放在public文件夹中
 */
const AVATAR_FILENAME = "avatar.jpg";

/**
 * 获取头像完整路径
 * Next.js的basePath配置会自动处理路径前缀，这里只返回标准的绝对路径
 * @returns 头像的完整路径
 */
export const getAvatarPath = (): string => {
  return `/${AVATAR_FILENAME}`;
};

// 向后兼容的导出，建议使用 getAvatarPath() 函数
export const avatar = getAvatarPath();

export const isBorder = true; //控制头像边框是否显示
export const name = "XHY"; //名字
export const slogan =
  "在技术的海洋中探索，在代码的世界里创造，用文字记录成长的足迹"; //个人介绍
//https://simpleicons.org 图标配置 图云
const slugs = [
  "typescript",
  "javascript",
  "react",
  "vuedotjs",
  "Vite",
  "html5",
  "css",
  "Vitest",
  "ESLint",
  "Prettier",
  "C",
  "C++",
  "nodedotjs",
  "nextdotjs",
  "git",
  "github",
  "gitlab",
];
/*
  关于技术栈图云配置说明
1. 可以使用 https://simpleicons.org 提供的图标，图标名称需要与 slugs 中的名称一致
2. 如果想上传自定义图片，将image配置成自定义图片的url数组
*/

//simpleicons版本
export const images = slugs.map(
  (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
);

//自定义图片版本

// export const images = [
//   "https://images.unsplash.com/photo-1720048171230-c60d162f93a0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "/avatar.jpg",
// ];
export const aboutMeP1 = "天津理工大学计算机科学与技术专业就读，2027年毕业 "; //关于我页面第一段
export const aboutMeP2 = "热爱技术，热爱生活，希望自己能创造更多价值 "; //关于我页面第一段
export const mainContactMeDescription =
  "如果你对我的文章感兴趣，或者想要交流技术话题，欢迎与我联系！"; //联系我页面描述
export const subContactMeDescription = "我会尽快回复你的消息 ✨"; //联系我页面补充描述
export const mail = "mailto:haoyang05.xu@gmail.com"; //邮箱配置
export const github = "https://github.com/seasalt-haiyan"; //github配置
