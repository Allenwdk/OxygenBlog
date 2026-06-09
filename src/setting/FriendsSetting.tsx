/**
 * 友情链接配置
 * 配置友链页面的标题、描述、友链分组和交换信息
 */

export interface FriendLink {
  name: string;
  description: string;
  url: string;
  avatar?: string;
}

export interface FriendGroup {
  groupName: string;
  links: FriendLink[];
}

// 页面标题
export const pageTitle = "友情链接";

// 页面描述
export const pageDescription = "以下是我认识的博主和朋友们，点击即可访问他们的主页";

// 友链分组
export const friendGroups: FriendGroup[] = [
  {
    groupName: "推荐",
    links: [
      {
        name: "示例友链",
        description: "这是一个示例友链，你可以替换成自己的友链信息",
        url: "https://example.com",
        avatar: "",
      },
    ],
  },
];

// 交换友链信息
export const exchangeInfo = {
  enabled: true,
  title: "交换友链",
  content:
    "欢迎交换友链！请先添加我的博客链接，然后在 GitHub 提交 Issue 并附上你的博客信息，我会尽快处理。",
};
