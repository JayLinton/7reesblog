import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Footer } from '../components/Footer';
import { friendLinksData, usefulLinksData } from '../data/links';
import { Language } from '../types';

const LinksView: React.FC<{ lang: Language }> = ({ lang }) => {
  const [tab, setTab] = useState<'friends' | 'useful'>('friends');

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      /* Reduced top padding on mobile */
      className="min-h-screen pt-28 md:pt-40 px-6 max-w-3xl mx-auto flex flex-col"
    >
      <div className="flex justify-center gap-12 mb-12 md:mb-16">
        <button
          onClick={() => setTab('friends')}
          /* Enlarge toggle buttons from text-xs to text-sm */
          className={`text-sm tracking-[0.2em] uppercase transition-all duration-300 pb-2
            ${tab === 'friends' 
              ? 'border-b border-black dark:border-white text-black dark:text-white' 
              : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          {lang === 'zh' ? '友情链接' : 'Friends'}
        </button>
        <button
          onClick={() => setTab('useful')}
          /* Enlarge toggle buttons from text-xs to text-sm */
          className={`text-sm tracking-[0.2em] uppercase transition-all duration-300 pb-2
            ${tab === 'useful' 
              ? 'border-b border-black dark:border-white text-black dark:text-white' 
              : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          {lang === 'zh' ? '常用链接' : 'Useful'}
        </button>
      </div>

      <div className="">
        {tab === 'friends' ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12" /* Reduced gap for mobile */
          >
            {friendLinksData.map((link) => (
              <a 
                key={link.id}
                href={link.url}
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-gray-100 dark:border-neutral-800 mb-4 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-md bg-gray-50 dark:bg-neutral-800">
                  <img src={link.avatar} alt={link.name} className="w-full h-full object-cover" />
                </div>
                <span className="serif text-lg text-neutral-800 dark:text-neutral-200 mb-1">{link.name}</span>
                {link.title && (
                  <span className="text-[9px] tracking-wider text-gray-400 dark:text-gray-500 uppercase">{link.title}</span>
                )}
              </a>
            ))}
          </motion.div>
        ) : (
          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6"
          >
            {usefulLinksData.map((link) => (
               <a 
                key={link.id}
                href={link.url}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-neutral-800 hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 px-2 transition-colors group"
               >
                 <span className="text-sm font-light text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white">{link.name}</span>
                 <ExternalLink className="w-3 h-3 text-gray-300 dark:text-neutral-600 group-hover:text-gray-500 dark:group-hover:text-neutral-400" />
               </a>
            ))}
          </motion.div>
        )}
      </div>

      {tab === 'friends' && (
        <div className="mt-16 pt-10 border-t border-gray-100 dark:border-neutral-800 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-light tracking-wide mb-4">
            {lang === 'zh' ? '交换友链' : 'Exchange Links'}
          </p>
          <div className="text-[10px] text-gray-400 dark:text-gray-600 tracking-widest leading-loose uppercase">
            <p className="text-neutral-600 dark:text-neutral-400 mb-2">
              7rees / 自由如飞鸟 / http://www.7rees.cc / <a href="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAENIntpQ-d_KUk_d1zunZPb9kqOmPtXHgACWDcAAjgIIFbVnCofqV4kczYE.jpg" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white underline decoration-gray-300 dark:decoration-neutral-700 underline-offset-4">[Avatar]</a>
            </p>
            <p>Format: Name / Title / URL / Avatar</p>
            <p>Send to: <a href="mailto:1063750098@qq.com" className="hover:text-black dark:hover:text-white underline decoration-gray-300 dark:decoration-neutral-700 underline-offset-4">1063750098@qq.com</a></p>
          </div>
        </div>
      )}
      
      <div className="flex-grow"></div>
      <Footer className="mt-16" />
    </motion.div>
  );
};

export default LinksView;