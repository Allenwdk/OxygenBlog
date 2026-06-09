/**
 * 友情链接页面配置
 * 所有友链数据集中在此管理，便于静态导出时直接嵌入页面
 */

/**
 * 友链数据接口
 */
export interface FriendLink {
  /** 网站名称 */
  name: string;
  /** 网站描述 */
  description: string;
  /** 网站地址 */
  url: string;
  /** 头像或图标地址，为空则使用默认图标 */
  avatar?: string;
}

/**
 * 页面标题配置
 */
export const pageTitle = "友情链接";

/**
 * 页面副标题/描述
 */
export const pageDescription = "这里记录了一些有趣的站点，欢迎互访交流";

/**
 * 友链列表配置
 * 按照分组方式管理友链，便于分类展示
 */
export const friendGroups: { groupName: string; links: FriendLink[] }[] = [
  {
    groupName: "朋友们",
    links: [
      {
        name: "心想事成的 Blog",
        description: "开开心心每一天",
        url: "https://blog.xinchengp.cn",
        avatar: "https://avatars.githubusercontent.com/u/107662142?v=4",
      },
    ],
  },
];

/**
 * 交换友链提示信息配置
 */
export const exchangeInfo = {
  /** 是否显示交换友链提示 */
  enabled: true,
  /** 提示标题 */
  title: "交换友链",
  /** 提示内容 */
  content:
    "如果你想交换友链，欢迎通过关于页面的联系方式与我取得联系。请提供：网站名称、网站地址、简短描述和头像链接。",
};
