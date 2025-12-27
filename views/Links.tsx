import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, MessageSquare } from 'lucide-react';
import { Footer } from '../components/Footer';
import { friendLinksData, usefulLinksData } from '../data/links';
import { Language } from '../types';

// Artalk 实例类型定义
declare var Artalk: any;

const LinksView: React.FC<{ lang: Language }> = ({ lang }) => {
  // 使用 sessionStorage 持久化 Tab 状态
  const [tab, setTab] = useState<'friends' | 'comments' | 'useful'>(() => {
    const savedTab = sessionStorage.getItem('7rees-links-tab');
    return (savedTab as any) || 'friends';
  });
  
  const artalkRef = useRef<any>(null);
  
  const getTheme = () => document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  // 1. 监听 Tab 变化并存储
  useEffect(() => {
    sessionStorage.setItem('7rees-links-tab', tab);
  }, [tab]);

  // 2. 监听主题变化并实时应用到 Artalk
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (artalkRef.current) {
        artalkRef.current.setDarkMode(getTheme() === 'dark');
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // 3. Artalk 初始化逻辑
  useEffect(() => {
    if (tab === 'comments') {
      const loadArtalk = async () => {
        if (!document.getElementById('artalk-css')) {
          const link = document.createElement('link');
          link.id = 'artalk-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/artalk/dist/Artalk.css';
          document.head.appendChild(link);
        }

        if (typeof Artalk === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/artalk/dist/Artalk.js';
          script.async = true;
          script.onload = () => setTimeout(initArtalk, 150);
          document.body.appendChild(script);
        } else {
          setTimeout(initArtalk, 150);
        }
      };

      const initArtalk = () => {
        const el = document.getElementById('artalk-container');
        if (el && !artalkRef.current) {
          artalkRef.current = Artalk.init({
            el: '#artalk-container',
            pageKey: '/links/guestbook',
            pageTitle: lang === 'zh' ? '留言板' : 'Guestbook',
            server: 'https://comment.7rees.cc',
            site: '7rees_Blog',
            darkMode: getTheme() === 'dark',
            placeholder: lang === 'zh' ? '见字如面，不负相遇...' : 'Every word is a footprint...',
          });
        }
      };

      loadArtalk();
    }

    return () => {
      if (artalkRef.current) {
        artalkRef.current.destroy();
        artalkRef.current = null;
      }
    };
  }, [tab, lang]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen pt-28 md:pt-40 px-6 max-w-3xl mx-auto flex flex-col"
    >
      {/* 极简 Tab 导航 */}
      <div className="flex justify-center gap-8 md:gap-16 mb-16 md:mb-20 flex-wrap">
        {[
          { id: 'friends', zh: '友情链接', en: 'FRIENDS' },
          { id: 'comments', zh: '留言板', en: 'GUESTBOOK' },
          { id: 'useful', zh: '常用链接', en: 'USEFUL' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id as any)}
            className={`text-xs md:text-sm tracking-[0.25em] transition-all duration-500 pb-2 relative group uppercase
              ${tab === item.id 
                ? 'text-black dark:text-white font-normal' 
                : 'text-gray-400 dark:text-neutral-600 hover:text-gray-600 dark:hover:text-neutral-400'}`}
          >
            {lang === 'zh' ? item.zh : item.en}
            {tab === item.id && (
              <motion.div 
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 w-full h-[1px] bg-black dark:bg-white"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {tab === 'friends' && (
            <motion.div 
              key="friends"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16"
            >
              {friendLinksData.map((link) => (
                <a 
                  key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border border-gray-100 dark:border-neutral-900 mb-5 transition-all duration-700 group-hover:scale-[1.03] group-hover:shadow-xl bg-gray-50 dark:bg-neutral-900 relative">
                    <img src={link.avatar} alt={link.name} className="w-full h-full object-cover transition-opacity duration-700" />
                  </div>
                  <span className="serif text-xl text-neutral-800 dark:text-neutral-200 mb-1 !font-normal group-hover:text-black dark:group-hover:text-white transition-colors">{link.name}</span>
                  {link.title && (
                    <span className="text-[10px] tracking-widest text-gray-400 dark:text-neutral-600 uppercase font-light">{link.title}</span>
                  )}
                </a>
              ))}
            </motion.div>
          )}

          {tab === 'comments' && (
            <motion.div 
              key="comments"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-3xl mx-auto"
            >
              <div className="mb-14 text-center">
                <MessageSquare className="w-5 h-5 mx-auto mb-5 text-neutral-300 dark:text-neutral-700 font-light" />
                <h3 className="serif text-2xl md:text-3xl text-neutral-800 dark:text-neutral-100 !font-normal tracking-wide">
                  {lang === 'zh' ? '留下一言' : 'Leave a message'}
                </h3>
                <p className="text-[10px] tracking-[0.3em] text-gray-400 dark:text-neutral-600 mt-3 uppercase font-light">
                  {lang === 'zh' ? '见字如面，不负相遇' : 'Every word is a footprint'}
                </p>
              </div>
              <div id="artalk-container" className="artalk-minimal-theme min-h-[500px]"></div>
            </motion.div>
          )}

          {tab === 'useful' && (
            <motion.div 
              key="useful"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4"
            >
              {usefulLinksData.map((link) => (
                <a 
                  key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between py-6 border-b border-gray-50 dark:border-neutral-900 hover:bg-gray-50/40 dark:hover:bg-neutral-900/40 px-4 transition-all duration-300 group"
                >
                  <span className="text-sm font-light text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white tracking-wide transition-colors">{link.name}</span>
                  <ExternalLink className="w-3 h-3 text-neutral-300 dark:text-neutral-700 group-hover:text-black dark:group-hover:text-white transition-all opacity-0 group-hover:opacity-100" />
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {tab === 'friends' && (
        <div className="mt-28 pt-12 border-t border-gray-100 dark:border-neutral-900 text-center">
          <p className="text-[12px] text-gray-400 dark:text-neutral-600 font-light tracking-[0.4em] mb-6 uppercase">
            {lang === 'zh' ? '交换链接' : 'EXCHANGE LINKS'}
          </p>
          <div className="text-[10px] text-gray-400 dark:text-neutral-500 tracking-[0.15em] leading-loose uppercase">
            <p className="text-neutral-600 dark:text-neutral-400 mb-3 select-all">
              7rees / 自由流动的树 / HTTPS://WWW.7REES.CC / <a href="https://s2.loli.net/2025/12/25/qf3ZGRr6iuCgO2e.jpg" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white underline underline-offset-4 decoration-neutral-200 dark:decoration-neutral-800 transition-colors">[AVATAR]</a>
            </p>
            <p className="opacity-50">Format: Name / Title / URL / Avatar</p>
            <p>Send to: <a href="mailto:1063750098@qq.com" className="hover:text-black dark:hover:text-white underline decoration-gray-300 dark:decoration-neutral-700 underline-offset-4">1063750098@qq.com</a></p>
            <p className="opacity-50">
              {lang === 'zh' ? '或直接在留言板页面留言' : 'Or leave a comment on the Guestbook'}
            </p>
          </div>
        </div>
      )}
      <Footer className="mt-20" />
    </motion.div>
  );
};

export default LinksView;