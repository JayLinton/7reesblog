import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Footer } from '../components/Footer';
import { articlesData } from '../data/articles';
import { Language } from '../types';

const AboutView: React.FC<{ lang: Language }> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'me' | 'site'>('me');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const meArticle = articlesData.find(a => a.id === 'aboutme');
  const siteArticle = articlesData.find(a => a.id === '5');
  const currentArticle = activeTab === 'me' ? meArticle : siteArticle;

  // 统计数据计算
  const stats = useMemo(() => {
    // 运行天数计算
    const startDate = new Date('2025-12-12').getTime();
    const now = Date.now();
    const daysSince = Math.max(0, Math.floor((now - startDate) / (1000 * 60 * 60 * 24)));

    // 全站字数计算 (统计所有非隐藏文章的中英文标题和正文长度)
    const totalChars = articlesData.reduce((acc, art) => {
      if (art.hidden) return acc;
      const cnLen = (art.titleCN || '').length + (art.contentCN || '').length;
      const enLen = (art.titleEN || '').length + (art.contentEN || '').length;
      // 我们取较大的一边作为“已落下的叶子”统计
      return acc + Math.max(cnLen, enLen);
    }, 0);

    return { daysSince, totalChars };
  }, []);

  const content = useMemo(() => {
    if (!currentArticle) return '';
    let raw = lang === 'zh' ? currentArticle.contentCN : currentArticle.contentEN;

    // 占位符动态替换逻辑
    if (activeTab === 'site') {
      const statsStr = lang === 'zh' 
        ? `这片树林在 **${stats.daysSince}** 天里已经落下了 **${stats.totalChars.toLocaleString()}** 字的树叶。`
        : `This forest has shed **${stats.totalChars.toLocaleString()}** words of leaves over the past **${stats.daysSince}** days.`;
      raw = raw.replace('{SITE_STATS}', statsStr);
    }

    return raw;
  }, [currentArticle, lang, activeTab, stats]);

  // 提取正文中的所有图片链接
  const imagesList = useMemo(() => {
    const urls: string[] = [];
    const mdRegex = /!\[.*?\]\((.*?)\)/g;
    const htmlRegex = /<img.*?src=["'](.*?)["'].*?>/g;
    
    let match;
    while ((match = mdRegex.exec(content)) !== null) urls.push(match[1]);
    while ((match = htmlRegex.exec(content)) !== null) urls.push(match[1]);
    
    return Array.from(new Set(urls));
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setActiveImageIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, imagesList]);

  const handlePrev = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev! - 1 + imagesList.length) % imagesList.length);
  };

  const handleNext = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev! + 1) % imagesList.length);
  };

  const MarkdownComponents = {
    img: ({ node, ...props }: any) => {
      const idx = imagesList.indexOf(props.src);
      return (
        <img 
          {...props} 
          className="cursor-zoom-in transition-transform duration-300 hover:opacity-95"
          onClick={() => setActiveImageIndex(idx !== -1 ? idx : 0)}
          alt={props.alt || 'About Image'}
        />
      );
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen pt-28 md:pt-36 px-6 max-w-2xl mx-auto flex flex-col"
    >
      {/* 画廊灯箱 */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 dark:bg-black/98 backdrop-blur-xl"
          >
            <button
              className="absolute top-6 right-6 md:top-10 md:right-10 z-[110] p-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              onClick={() => setActiveImageIndex(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] font-mono text-neutral-400">
              {activeImageIndex + 1} / {imagesList.length}
            </div>

            {imagesList.length > 1 && (
              <>
                <button 
                  className="absolute left-4 md:left-10 z-[110] p-4 text-neutral-300 hover:text-black dark:hover:text-white transition-all transform hover:scale-110"
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                >
                  <ChevronLeft className="w-8 h-8 stroke-1" />
                </button>
                <button 
                  className="absolute right-4 md:right-10 z-[110] p-4 text-neutral-300 hover:text-black dark:hover:text-white transition-all transform hover:scale-110"
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                >
                  <ChevronRight className="w-8 h-8 stroke-1" />
                </button>
              </>
            )}

            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-20" onClick={() => setActiveImageIndex(null)}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={imagesList[activeImageIndex]}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  src={imagesList[activeImageIndex]}
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-10 md:mb-14">
        <motion.h1 
          key={lang}
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 0.9, y: 0 }}
          className="serif text-2xl md:text-3xl lg:text-4xl text-neutral-900 dark:text-neutral-100 tracking-[0.3em] font-light uppercase"
        >
          {lang === 'zh' ? '梦到什么写什么' : 'Write What I Dream'}
        </motion.h1>
      </div>

      <div className="flex justify-center gap-12 mb-12 md:mb-16">
        {[
          { id: 'me', zh: '关于我', en: 'ABOUT ME' },
          { id: 'site', zh: '关于本站', en: 'ABOUT SITE' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-[10px] md:text-xs tracking-[0.3em] uppercase transition-all duration-300 pb-2 relative
              ${activeTab === tab.id 
                ? 'text-black dark:text-white font-medium' 
                : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            {lang === 'zh' ? tab.zh : tab.en}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="aboutTabUnderline"
                className="absolute bottom-0 left-0 w-full h-[1px] bg-black dark:bg-white"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-grow"
        >
          {currentArticle ? (
            <article className="w-full max-w-full prose prose-neutral dark:prose-invert prose-sm md:prose-base mx-auto font-light text-gray-700 dark:text-gray-300 leading-loose prose-headings:font-serif prose-headings:font-light prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100 prose-a:text-black dark:prose-a:text-white prose-blockquote:border-l-gray-200 dark:prose-blockquote:border-l-neutral-700 prose-img:rounded-sm overflow-x-hidden">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
                components={MarkdownComponents}
              >
                {content}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="text-center py-20 text-gray-300 dark:text-neutral-700 text-[10px] tracking-[0.5em] uppercase">
              Content is drifting away...
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      <Footer className="mt-20" />
    </motion.div>
  );
};

export default AboutView;