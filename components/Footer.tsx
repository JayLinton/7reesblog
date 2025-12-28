import React, { useMemo } from 'react';
import { articlesData } from '../data/articles';
import { Language } from '../types';

interface FooterProps {
  className?: string;
  lang?: Language;
}

export const Footer: React.FC<FooterProps> = ({ className, lang = 'zh' }) => {
  const stats = useMemo(() => {
    // 运行天数计算
    const startDate = new Date('2025-12-12').getTime();
    const now = Date.now();
    const daysSince = Math.max(0, Math.floor((now - startDate) / (1000 * 60 * 60 * 24)));

    // 全站字数计算 (统计所有非隐藏文章的中中文/英文标题和正文长度)
    const totalChars = articlesData.reduce((acc, art) => {
      if (art.hidden) return acc;
      const cnLen = (art.titleCN || '').length + (art.contentCN || '').length;
      const enLen = (art.titleEN || '').length + (art.contentEN || '').length;
      // 取较大的一边作为字数统计
      return acc + Math.max(cnLen, enLen);
    }, 0);

    return { daysSince, totalChars };
  }, []);

  const statsText = lang === 'zh'
    ? `这片树林在 ${stats.daysSince} 天里已经落下了 ${stats.totalChars.toLocaleString()} 字的树叶`
    : `This forest has shed ${stats.totalChars.toLocaleString()} words of leaves over the past ${stats.daysSince} days`;

  return (
    <footer className={`w-full text-center py-6 ${className}`}>
      <p className="text-[10px] tracking-[0.2em] text-gray-400 dark:text-neutral-600 mb-2 opacity-70 uppercase font-light">
        {statsText}
      </p>
      <p className="text-[10px] tracking-widest text-gray-400 dark:text-neutral-600 opacity-80">
        &copy; {new Date().getFullYear()} 7REES. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
};