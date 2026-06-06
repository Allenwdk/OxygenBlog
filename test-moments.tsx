import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'src/content/moments');
  
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  
  const items = fs.readdirSync(contentDir);
  const results: Array<{ slug: string }> = [];
  
  for (const item of items) {
    const itemPath = path.join(contentDir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      const subItems = fs.readdirSync(itemPath);
      
      for (const subItem of subItems) {
        const subItemPath = path.join(itemPath, subItem);
        const subStat = fs.statSync(subItemPath);
        
        if (subStat.isDirectory()) {
          const subSubItems = fs.readdirSync(subItemPath);
          
          for (const subSubItem of subSubItems) {
            if (subSubItem === 'content.md') {
              const fullPath = path.join(subItemPath, subSubItem);
              const relativePath = path.relative(contentDir, fullPath);
              const slug = relativePath.replace(/\.md$/, '').replace(/[\/\\]/g, '-');
              
              results.push({ slug });
            }
          }
        }
      }
    }
  }
  
  return results;
}
