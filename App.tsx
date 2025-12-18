import React, { useRef, useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Language } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Moon, Sun, ArrowUp } from 'lucide-react';

// Lazy load view components
const HomeView = lazy(() => import('./views/Home'));
const ArticlesView = lazy(() => import('./views/Articles'));
const ArticleDetailView = lazy(() => import('./views/ArticleDetail'));
const ProjectsView = lazy(() => import('./views/Projects'));
const LinksView = lazy(() => import('./views/Links'));

// Loading Fallback
const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-gray-100 border-t-black rounded-full animate-spin dark:border-neutral-800 dark:border-t-white"></div>
  </div>
);

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize state from localStorage or defaults
  const [lang, setLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem('7rees-lang');
    return (savedLang as Language) || 'zh';
  });
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('7rees-theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  });
  
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();

  // Persist language changes
  useEffect(() => {
    localStorage.setItem('7rees-lang', lang);
  }, [lang]);

  // Persist theme changes and apply class
  useEffect(() => {
    localStorage.setItem('7rees-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Scroll to top on route change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  // Handle scroll listener for Back to Top button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative h-screen w-full overflow-y-scroll scroll-smooth no-scrollbar bg-gradient-to-b from-white to-gray-50 dark:from-[#111111] dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100`}
    >
      <Navbar />

      {/* Control Panel: Language, Theme & Back to Top */}
      <div className="fixed bottom-8 right-8 z-50 pointer-events-auto flex flex-col items-end gap-6">
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={scrollToTop}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors group shadow-sm"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-end gap-4">
          <button 
            onClick={toggleTheme}
            className="flex justify-end items-center gap-2 text-[10px] tracking-widest font-light text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            title="Toggle Dark Mode"
          >
            {theme === 'light' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
          </button>
          
          <button 
            onClick={toggleLanguage}
            className="flex justify-end items-center gap-2 text-[10px] tracking-widest font-light text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <span>{lang === 'zh' ? 'EN' : 'CN'}</span>
            <Globe className="w-3 h-3" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomeView lang={lang} />} />
            <Route path="/articles" element={<ArticlesView lang={lang} />} />
            <Route path="/articles/:id" element={<ArticleDetailView lang={lang} />} />
            <Route path="/projects" element={<ProjectsView lang={lang} />} />
            <Route path="/links" element={<LinksView lang={lang} />} />
            {/* Fallback route */}
            <Route path="*" element={<HomeView lang={lang} />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </div>
  );
};

export default App;