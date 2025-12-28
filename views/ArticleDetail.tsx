import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Footer } from '../components/Footer';
import { articlesData } from '../data/articles';
import { Language } from '../types';

const ArticleDetailView: React.FC<{ lang: Language }> = ({ lang }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  
  const article = articlesData.find(a => a.id === id);
  const content = useMemo(() => {
    if (!article) return '';
    return lang === 'zh' ? article.contentCN : article.contentEN;
  }, [article, lang]);

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

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
         <p className="text-xs tracking-widest text-gray-400 mb-4">404 - NOT FOUND</p>
         <button onClick={() => navigate('/articles')} className="text-xs underline">GO BACK</button>
      </div>
    );
  }

  const handlePrev = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev! - 1 + imagesList.length) % imagesList.length);
  };

  const handleNext = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev! + 1) % imagesList.length);
  };

  const handleBack = () => {
    navigate('/articles', { state: { category: article.category } });
  };

  const MarkdownComponents = {
    img: ({ node, ...props }: any) => {
      const idx = imagesList.indexOf(props.src);
      return (
        <img 
          {...props} 
          className="cursor-zoom-in transition-transform duration-300 hover:opacity-95"
          onClick={() => setActiveImageIndex(idx !== -1 ? idx : 0)}
          alt={props.alt || 'Article Image'}
        />
      );
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen pt-28 md:pt-40 px-6 max-w-2xl mx-auto flex flex-col"
    >
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

      <button 
        onClick={handleBack}
        className="group flex items-center gap-2 text-xs tracking-widest text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-12"
      >
        <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
        {lang === 'zh' ? '返回文章' : 'BACK TO ARTICLES'}
      </button>

      <div className="mb-12 text-center border-b border-gray-50 dark:border-neutral-800 pb-8">
        <h1 className="serif text-2xl md:text-3xl lg:text-4xl text-neutral-900 dark:text-neutral-100 mb-6">
          {lang === 'zh' ? article.titleCN : article.titleEN}
        </h1>
        <div className="flex justify-center items-center gap-4 text-sm font-medium tracking-wide text-gray-400 dark:text-gray-500 uppercase">
          <span>{article.date}</span>
          <span className="opacity-50">/</span>
          <span>{article.category}</span>
        </div>
      </div>

      <article className="w-full max-w-full prose prose-neutral dark:prose-invert prose-sm md:prose-base mx-auto font-light text-gray-700 dark:text-gray-300 leading-loose prose-headings:font-serif prose-headings:font-light prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100 prose-a:text-black dark:prose-a:text-white prose-blockquote:border-l-gray-200 dark:prose-blockquote:border-l-neutral-700 prose-blockquote:text-gray-500 dark:prose-blockquote:text-gray-400 prose-blockquote:italic prose-img:rounded-sm overflow-x-hidden">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
          components={MarkdownComponents}
        >
          {content}
        </ReactMarkdown>
      </article>
      
      <p className="text-gray-200 dark:text-neutral-800 mt-16 text-center text-xs tracking-widest">***</p>
      
      <div className="flex-grow"></div>
      <Footer className="mt-16" lang={lang} />
    </motion.div>
  );
};

export default ArticleDetailView;