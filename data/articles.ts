import { Article } from '../types';

/**
 * 自动加载 /articles 目录下的所有 .md 文件。
 */
const modules = (import.meta as any).glob('../articles/*.md', { 
  eager: true, 
  query: '?raw', 
  import: 'default' 
});

// 简单的 Frontmatter 解析器
const parseArticle = (filePath: string, fileContent: string): Article => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    console.warn(`File ${filePath} is missing frontmatter.`);
    return {
      id: '0',
      titleCN: 'Error',
      titleEN: 'Error',
      date: '0000.00.00',
      category: 'interest',
      contentCN: 'Parse Error',
      contentEN: 'Parse Error'
    };
  }

  const metadataRaw = match[1];
  const fullContent = match[2].trim();

  const metadata: any = {};
  metadataRaw.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts) {
      metadata[key.trim()] = valueParts.join(':').trim();
    }
  });

  const splitContent = fullContent.split('[EN_START]');
  const contentCN = splitContent[0].trim();
  const contentEN = splitContent[1] ? splitContent[1].trim() : contentCN;

  return {
    id: metadata.id || Math.random().toString(),
    titleCN: metadata.titleCN || 'Untitled',
    titleEN: metadata.titleEN || 'Untitled',
    date: metadata.date || 'Unknown Date',
    category: (metadata.category as string) || 'interest',
    contentCN,
    contentEN,
    hidden: metadata.hidden === 'true',
    pinned: metadata.pinned === 'true'
  };
};

export const articlesData: Article[] = Object.entries(modules)
  .map(([path, content]) => parseArticle(path, content as string))
  .sort((a, b) => {
    // 置顶逻辑：pinned 为 true 的文章排在前面
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    // 其次按日期倒序排列
    return b.date.localeCompare(a.date);
  });