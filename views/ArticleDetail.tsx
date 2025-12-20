import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../components/Footer';
import { articlesData } from '../data/articles';
import { Language } from '../types';

const ArticleDetailView: React.FC<{ lang: Language }> = ({ lang }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const article = articlesData.find(a => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
         <p className="text-xs tracking-widest text-gray-400 mb-4">404 - NOT FOUND</p>
         <button onClick={() => navigate('/articles')} className="text-xs underline">GO BACK</button>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/articles', { 
      state: { category: article.category } 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      /* Reduced top padding on mobile */
      className="min-h-screen pt-28 md:pt-40 px-6 max-w-2xl mx-auto flex flex-col"
    >
      <button 
        onClick={handleBack}
        /* Increased text size from text-[10px] to text-xs */
        className="group flex items-center gap-2 text-xs tracking-widest text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-12"
      >
        <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
        {lang === 'zh' ? '返回文章' : 'BACK TO ARTICLES'}
      </button>

      <div className="mb-12 text-center border-b border-gray-50 dark:border-neutral-800 pb-8">
        {/* Responsive title size: smaller on mobile */}
        <h1 className="serif text-2xl md:text-3xl lg:text-4xl text-neutral-900 dark:text-neutral-100 mb-6">
          {lang === 'zh' ? article.titleCN : article.titleEN}
        </h1>
        {/* 
          Unified Time and Category:
          - Same color (text-gray-400 dark:text-gray-500)
          - Same font size (text-sm)
          - Same row (flex)
        */}
        <div className="flex justify-center items-center gap-4 text-sm font-medium tracking-wide text-gray-400 dark:text-gray-500 uppercase">
          <span>{article.date}</span>
          <span className="opacity-50">/</span>
          <span>{article.category}</span>
        </div>
      </div>

      <article className="w-full max-w-full prose prose-neutral dark:prose-invert prose-sm md:prose-base mx-auto font-light text-gray-700 dark:text-gray-300 leading-loose prose-headings:font-serif prose-headings:font-light prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100 prose-a:text-black dark:prose-a:text-white prose-blockquote:border-l-gray-200 dark:prose-blockquote:border-l-neutral-700 prose-blockquote:text-gray-500 dark:prose-blockquote:text-gray-400 prose-blockquote:italic prose-img:rounded-sm overflow-x-hidden">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {lang === 'zh' ? article.contentCN : article.contentEN}
        </ReactMarkdown>
      </article>
      
      <p className="text-gray-200 dark:text-neutral-800 mt-16 text-center text-xs tracking-widest">***</p>
      
      <div className="flex-grow"></div>
      <Footer className="mt-16" />
    </motion.div>
  );
};

export default ArticleDetailView;