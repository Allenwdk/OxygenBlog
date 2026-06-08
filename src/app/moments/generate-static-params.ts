import fs from 'fs';
import path from 'path';

export function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'public/shared/moments');

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return scanMarkdownFiles(contentDir, contentDir).map(({ slug }) => ({ slug }));
}

function scanMarkdownFiles(dir: string, baseDir: string): Array<{ filePath: string; relativePath: string; slug: string }> {
  const results: Array<{ filePath: string; relativePath: string; slug: string }> = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        results.push(...scanMarkdownFiles(itemPath, baseDir));
      } else if (item === 'content.md') {
        const relativePath = path.relative(baseDir, itemPath);
        const slug = relativePath.replace(/\.md$/, '').replace(/[\/\\]/g, '-');
        
        results.push({ filePath: itemPath, relativePath, slug });
      }
    });
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
  
  return results;
}
