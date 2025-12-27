import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// 配置信息
const CONFIG = {
    domain: 'https://www.7rees.cc', 
    blogName: '7rees | 自由流动的树',
    // 你的文章存放在根目录下的 articles 文件夹
    articlesDir: path.join(process.cwd(), 'articles'),
    // 生成的文件存放在根目录下的 public 文件夹
    publicDir: path.join(process.cwd(), 'public'),
};

function run() {
    // 1. 检查目录是否存在
    if (!fs.existsSync(CONFIG.articlesDir)) {
        console.error(`❌ 找不到文章目录: ${CONFIG.articlesDir}`);
        process.exit(1);
    }

    // 2. 读取所有 .md 文件
    const files = fs.readdirSync(CONFIG.articlesDir).filter(f => f.endsWith('.md'));
    const articles = [];

    console.log(`正在解析 ${files.length} 个 Markdown 文件...`);

    files.forEach(file => {
        const rawContent = fs.readFileSync(path.join(CONFIG.articlesDir, file), 'utf-8');
        
        // 正则拆分 Frontmatter (---...---) 和正文
        const match = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        
        if (match) {
            const yamlStr = match[1];
            const bodyStr = match[2];

            // 简单解析 Frontmatter
            const meta = {};
            yamlStr.split('\n').forEach(line => {
                const [key, ...val] = line.split(':');
                if (key && val.length) meta[key.trim()] = val.join(':').trim();
            });

            // 过滤掉隐藏文章
            if (meta.hidden !== 'true') {
                // 处理正文：只取中文部分（[EN_START] 之前）
                const chineseBody = bodyStr.split('[EN_START]')[0].trim();
                
                // 将 Markdown 转换为 HTML，供 RSS 阅读器渲染
                const htmlContent = marked.parse(chineseBody);

                articles.push({
                    ...meta,
                    htmlContent: htmlContent,
                    fileName: file
                });
            }
        }
    });

    // 3. 按日期排序 (从新到旧)
    articles.sort((a, b) => b.date.localeCompare(a.date));

    // 4. 生成 RSS 每一项 (Item)
    const rssItems = articles.map(a => {
        const itemUrl = `${CONFIG.domain}/articles/${a.id}`;
        
        // 格式化日期为 RFC822 (RSS 标准)
        // 你的日期格式 2024.01.01 需转换为 2024/01/01 才能被 Date 正确解析
        const dateObj = new Date(a.date.replace(/\./g, '/'));
        const pubDate = isNaN(dateObj.getTime()) ? new Date().toUTCString() : dateObj.toUTCString();

        return `
    <item>
      <title><![CDATA[${a.titleCN || '无标题'}]]></title>
      <link>${itemUrl}</link>
      <guid isPermaLink="false">${a.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${a.category || '未分类'}]]></category>
      <description><![CDATA[${a.titleCN}]]></description>
      <content:encoded><![CDATA[
        <div class="markdown-body" style="font-family: sans-serif; line-height: 1.6;">
          ${a.htmlContent}
        </div>
      ]]></content:encoded>
    </item>`;
    }).join('');

    // 5. 组装完整的 RSS XML
    const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${CONFIG.blogName}</title>
  <link>${CONFIG.domain}</link>
  <description>7rees | 自由流动的树</description>
  <language>zh-cn</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${CONFIG.domain}/rss.xml" rel="self" type="application/rss+xml" />
  ${rssItems}
</channel>
</rss>`;

    // 6. 生成 Sitemap 内容 (每行一个链接)
    const sitemapContent = articles.map(a => `${CONFIG.domain}/articles/${a.id}`).join('\n');

    // 7. 写入文件
    if (!fs.existsSync(CONFIG.publicDir)) fs.mkdirSync(CONFIG.publicDir);
    
    fs.writeFileSync(path.join(CONFIG.publicDir, 'rss.xml'), rssContent);
    fs.writeFileSync(path.join(CONFIG.publicDir, 'sitemap.txt'), sitemapContent);

    console.log(`✅ 生成成功！`);
    console.log(`   - 已扫描文章: ${files.length} 篇`);
    console.log(`   - 已录入 RSS: ${articles.length} 篇`);
    console.log(`   - 文件位置: public/rss.xml, public/sitemap.txt`);
}

run();