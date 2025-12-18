import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';
import { articlesData } from '../data/articles';
import { Category, Language } from '../types';

const ArticlesView: React.FC<{ lang: Language }> = ({ lang }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [category, setCategory] = useState<Category>(
    (location.state as { category?: Category })?.category || 'interest'
  );

  const filteredArticles = articlesData.filter(a => a.category === category && !a.hidden);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen pt-28 md:pt-40 px-6 max-w-2xl mx-auto flex flex-col"
    >
      <div className="flex justify-center gap-12 mb-12 md:mb-16">
        {(['interest', 'tech'] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-sm tracking-[0.2em] uppercase transition-all duration-300 pb-2
              ${category === cat 
                ? 'border-b border-black dark:border-white text-black dark:text-white' 
                : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            {cat === 'interest' 
              ? (lang === 'zh' ? '兴趣' : 'Interests') 
              : (lang === 'zh' ? '技术' : 'Technology')}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredArticles.map((article) => (
          <motion.div 
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group cursor-pointer text-center md:text-left border-b border-gray-50 dark:border-neutral-800 pb-6 last:border-0"
            onClick={() => navigate(`/articles/${article.id}`)}
          >
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
              <div className="flex items-center gap-2">
                {article.pinned && (
                  <span className="shrink-0 border border-neutral-200 dark:border-neutral-800 px-1.5 py-0.5 text-[10px] tracking-widest text-neutral-400 dark:text-neutral-600 font-light mr-1.5 leading-none select-none">
                    {lang === 'zh' ? '置顶' : 'TOP'}
                  </span>
                )}
                <h3 className="serif text-xl text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all duration-300 text-left">
                  {lang === 'zh' ? article.titleCN : article.titleEN}
                </h3>
              </div>
              <span className="shrink-0 text-xs tracking-widest text-gray-400 dark:text-gray-500 font-medium md:ml-8">
                {article.date}
              </span>
            </div>
          </motion.div>
        ))}
        {filteredArticles.length === 0 && (
          <p className="text-center text-gray-300 dark:text-gray-600 text-xs tracking-widest py-10">
            {lang === 'zh' ? '暂无文章' : 'NO ARTICLES FOUND'}
          </p>
        )}
      </div>
      
      <div className="flex-grow"></div>
      <Footer className="mt-16" />
    </motion.div>
  );
};

export default ArticlesView;