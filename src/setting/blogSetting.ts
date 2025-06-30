export const categories = ["all", "技术", "前端", "开发", "生活"];
//以下两个配置项如无需求，无须改动
/**
 * CC 协议类型
 */
export type CCLicenseType =
  | "CC BY"
  | "CC BY-SA"
  | "CC BY-NC"
  | "CC BY-NC-SA"
  | "CC BY-ND"
  | "CC BY-NC-ND";

/**
 * 博客转载声明配置
 */
export interface BlogCopyrightConfig {
  /** 是否显示转载声明 */
  showCopyright: boolean;
  /** 默认 CC 协议类型 */
  defaultLicense: CCLicenseType;
  /** 作者名称 */
  author: string;
  /** 网站名称 */
  siteName: string;
  /** 网站域名 */
  siteUrl: string;
}

/**
 * 默认转载声明配置
 */
export const copyrightConfig: BlogCopyrightConfig = {
  showCopyright: true, //是否显示版权声明
  defaultLicense: "CC BY-NC-SA", //默认版权声明协议
  author: "XuHaoYang", //作者
  siteName: "个人博客", //你网站的名称
  siteUrl: "https://xuhaoyang.top", //这里填写你的域名
};

export const EndWord = "感谢阅读！"; //每一篇博客结尾的话

/**
 * 获取 CC 协议信息，无需改动
 */
export const getCCLicenseInfo = (type: CCLicenseType) => {
  const licenseMap = {
    "CC BY": {
      name: "CC BY 4.0",
      url: "https://creativecommons.org/licenses/by/4.0/",
      description: "署名",
    },
    "CC BY-SA": {
      name: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/",
      description: "署名-相同方式共享",
    },
    "CC BY-NC": {
      name: "CC BY-NC 4.0",
      url: "https://creativecommons.org/licenses/by-nc/4.0/",
      description: "署名-非商业性使用",
    },
    "CC BY-NC-SA": {
      name: "CC BY-NC-SA 4.0",
      url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      description: "署名-非商业性使用-相同方式共享",
    },
    "CC BY-ND": {
      name: "CC BY-ND 4.0",
      url: "https://creativecommons.org/licenses/by-nd/4.0/",
      description: "署名-禁止演绎",
    },
    "CC BY-NC-ND": {
      name: "CC BY-NC-ND 4.0",
      url: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
      description: "署名-非商业性使用-禁止演绎",
    },
  };

  return licenseMap[type] || licenseMap["CC BY-NC-SA"];
};
