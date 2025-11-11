#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

/**
 * 自动发布博客文章到GitHub仓库
 */
class AutoPublisher {
  constructor() {
    this.owner = process.env.BLOG_GITHUB_OWNER || 'Allenwdk';
    this.repo = process.env.BLOG_GITHUB_REPO || 'OxygenBlog';
    this.branch = process.env.BLOG_GITHUB_BRANCH || 'main';
    this.token = process.env.BLOG_GITHUB_TOKEN;
    
    if (!this.token) {
      console.error('❌ 请设置BLOG_GITHUB_TOKEN环境变量');
      process.exit(1);
    }
    
    this.octokit = new Octokit({
      auth: this.token
    });
  }

  /**
   * 读取并解析Markdown文件的前置元数据
   */
  parseMarkdownFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      // 查找前置元数据边界
      let frontMatterStart = -1;
      let frontMatterEnd = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '---') {
          if (frontMatterStart === -1) {
            frontMatterStart = i;
          } else {
            frontMatterEnd = i;
            break;
          }
        }
      }
      
      if (frontMatterStart === -1 || frontMatterEnd === -1) {
        throw new Error('未找到有效的前置元数据');
      }
      
      // 解析前置元数据
      const frontMatter = {};
      const contentLines = lines.slice(frontMatterStart + 1, frontMatterEnd);
      
      for (const line of contentLines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.slice(0, colonIndex).trim();
          let value = line.slice(colonIndex + 1).trim();
          
          // 处理数组类型
          if (value.startsWith('[') && value.endsWith(']')) {
            try {
              value = JSON.parse(value.replace(/'/g, '"'));
            } catch (e) {
              value = value.slice(1, -1).split(',').map(v => v.trim().replace(/"/g, ''));
            }
          } else if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          
          frontMatter[key] = value;
        }
      }
      
      // 获取正文内容
      const body = lines.slice(frontMatterEnd + 1).join('\n').trim();
      
      return {
        frontMatter,
        body,
        title: frontMatter.title || path.basename(filePath, '.md')
      };
    } catch (error) {
      console.error(`❌ 解析文件失败: ${filePath}`, error.message);
      return null;
    }
  }

  /**
   * 生成文件路径和内容
   */
  generateFileContent(parsedContent) {
    const { frontMatter, body } = parsedContent;
    const today = new Date().toISOString().split('T')[0];
    
    // 确保日期格式正确
    if (!frontMatter.date) {
      frontMatter.date = today;
    }
    
    // 生成前端matter
    const frontMatterStr = Object.entries(frontMatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
        }
        return `${key}: "${value}"`;
      })
      .join('\n');
    
    return `---\n${frontMatterStr}\n---\n\n${body}`;
  }

  /**
   * 创建或获取目录路径
   */
  async ensureDirectory(path) {
    try {
      await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: path
      });
      return true;
    } catch (error) {
      if (error.status === 404) {
        // 目录不存在，需要创建
        return false;
      }
      throw error;
    }
  }

  /**
   * 创建目录
   */
  async createDirectory(dirPath, message = 'Create directory') {
    try {
      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: `${dirPath}/.gitkeep`,
        message: message,
        content: Buffer.from('# Auto-created directory').toString('base64'),
        branch: this.branch
      });
    } catch (error) {
      console.error(`❌ 创建目录失败: ${dirPath}`, error.message);
    }
  }

  /**
   * 上传文件到GitHub
   */
  async uploadFile(localFilePath, targetPath, commitMessage) {
    try {
      // 读取本地文件
      const fileBuffer = fs.readFileSync(localFilePath);
      const content = fileBuffer.toString('base64');
      
      // 检查文件是否已存在
      let sha;
      try {
        const { data } = await this.octokit.repos.getContent({
          owner: this.owner,
          repo: this.repo,
          path: targetPath,
          ref: this.branch
        });
        if (data && data.sha) {
          sha = data.sha;
        }
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }
      }
      
      // 上传或更新文件
      const result = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: targetPath,
        message: commitMessage,
        content: content,
        sha: sha,
        branch: this.branch
      });
      
      console.log(`✅ 成功上传: ${targetPath}`);
      return result;
    } catch (error) {
      console.error(`❌ 上传文件失败: ${targetPath}`, error.message);
      throw error;
    }
  }

  /**
   * 发布单篇文章
   */
  async publishArticle(markdownFilePath) {
    console.log(`📝 开始处理文件: ${markdownFilePath}`);
    
    // 解析文件
    const parsed = this.parseMarkdownFile(markdownFilePath);
    if (!parsed) {
      return false;
    }
    
    const { frontMatter, title } = parsed;
    
    // 生成目标文件路径
    const fileName = `${title.replace(/[^\w\-一-龥]/g, '-').toLowerCase()}.md`;
    const category = frontMatter.category || '技术';
    const targetPath = `src/content/blogs/${category}/${fileName}`;
    
    // 生成文件内容
    const fileContent = this.generateFileContent(parsed);
    const tempFilePath = path.join(__dirname, `temp_${Date.now()}.md`);
    
    try {
      // 写入临时文件
      fs.writeFileSync(tempFilePath, fileContent, 'utf8');
      
      // 确保目录存在
      const dirPath = `src/content/blogs/${category}`;
      const dirExists = await this.ensureDirectory(dirPath);
      if (!dirExists) {
        await this.createDirectory(dirPath, `Create category directory: ${category}`);
        // 等待一秒让GitHub处理目录创建
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // 上传文件
      const commitMessage = `📝 Add new article: ${frontMatter.title || title}`;
      await this.uploadFile(tempFilePath, targetPath, commitMessage);
      
      console.log(`🎉 文章发布成功: ${frontMatter.title || title}`);
      return true;
    } finally {
      // 清理临时文件
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }

  /**
   * 批量发布文章
   */
  async publishBatch(sourceDir) {
    console.log(`🔍 扫描目录: ${sourceDir}`);
    
    if (!fs.existsSync(sourceDir)) {
      console.error(`❌ 目录不存在: ${sourceDir}`);
      return;
    }
    
    const files = fs.readdirSync(sourceDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    if (markdownFiles.length === 0) {
      console.log('📂 目录中没有找到Markdown文件');
      return;
    }
    
    console.log(`📁 找到 ${markdownFiles.length} 个Markdown文件`);
    
    const results = [];
    for (const file of markdownFiles) {
      const filePath = path.join(sourceDir, file);
      try {
        const success = await this.publishArticle(filePath);
        results.push({ file, success });
        
        // 每次上传后等待一下，避免API限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ 发布失败: ${file}`, error.message);
        results.push({ file, success: false, error: error.message });
      }
    }
    
    // 输出结果统计
    const successCount = results.filter(r => r.success).length;
    console.log(`\n📊 发布统计:`);
    console.log(`   总数: ${results.length}`);
    console.log(`   成功: ${successCount}`);
    console.log(`   失败: ${results.length - successCount}`);
    
    if (successCount > 0) {
      console.log(`\n🚀 触发重新部署...`);
      try {
        await this.octokit.actions.createWorkflowDispatch({
          owner: this.owner,
          repo: this.repo,
          workflow_id: 'deploy.yml',
          ref: this.branch
        });
        console.log(`✅ 已触发重新部署`);
      } catch (error) {
        console.log(`⚠️  触发部署失败: ${error.message}`);
        console.log(`   请手动访问GitHub Actions页面触发部署`);
      }
    }
  }

  /**
   * 获取仓库信息
   */
  async getRepoInfo() {
    try {
      const { data } = await this.octokit.repos.get({
        owner: this.owner,
        repo: this.repo
      });
      
      console.log('📋 仓库信息:');
      console.log(`   仓库: ${data.full_name}`);
      console.log(`   分支: ${this.branch}`);
      console.log(`   最后更新: ${data.updated_at}`);
    } catch (error) {
      console.error('❌ 获取仓库信息失败:', error.message);
    }
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const publisher = new AutoPublisher();
  
  console.log('🚀 GitHub 博客自动发布工具\n');
  
  // 显示仓库信息
  await publisher.getRepoInfo();
  console.log('');
  
  if (args.length === 0) {
    // 扫描待发布目录
    const publishDir = path.join(__dirname, '..', 'temp-publish');
    await publisher.publishBatch(publishDir);
  } else if (args[0] === '--file' && args[1]) {
    // 发布单个文件
    await publisher.publishArticle(args[1]);
  } else if (args[0] === '--dir' && args[1]) {
    // 发布指定目录
    await publisher.publishBatch(args[1]);
  } else {
    console.log('用法:');
    console.log('  node auto-publish.js                 # 扫描 temp-publish 目录');
    console.log('  node auto-publish.js --file <path>   # 发布单个文件');
    console.log('  node auto-publish.js --dir <path>    # 发布指定目录');
    console.log('');
    console.log('环境变量:');
    console.log('  BLOG_GITHUB_TOKEN   # GitHub访问令牌');
    console.log('  BLOG_GITHUB_OWNER   # 仓库所有者 (默认: Allenwdk)');
    console.log('  BLOG_GITHUB_REPO    # 仓库名称 (默认: OxygenBlog)');
    console.log('  BLOG_GITHUB_BRANCH  # 分支名称 (默认: main)');
  }
}

// 运行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AutoPublisher;