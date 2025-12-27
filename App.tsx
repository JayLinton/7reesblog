import React, { useRef, useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Language } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Moon, Sun, ArrowUp, Sparkles, X } from 'lucide-react';
import { Fireworks } from './components/Fireworks';

// Lazy load view components
const HomeView = lazy(() => import('./views/Home'));
const ArticlesView = lazy(() => import('./views/Articles'));
const ArticleDetailView = lazy(() => import('./views/ArticleDetail'));
const LinksView = lazy(() => import('./views/Links'));
const AboutView = lazy(() => import('./views/About'));

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
  const [isFireworksActive, setIsFireworksActive] = useState(false);
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

  // Keyboard support for closing fireworks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFireworksActive) {
        setIsFireworksActive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFireworksActive]);

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

        <div className="flex flex-col items-end gap-5">
          <button 
            onClick={() => setIsFireworksActive(!isFireworksActive)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isFireworksActive ? 'text-black dark:text-white scale-110' : 'text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white'}`}
            title="Toggle Fireworks"
          >
            <Sparkles className={`w-10 h-10 ${isFireworksActive ? 'animate-pulse' : ''}`} />
            <span className="text-[11px] font-mono tracking-widest opacity-80">2026</span>
          </button>

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

      {/* Fireworks Overlay */}
      <AnimatePresence>
        {isFireworksActive && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-black/35 backdrop-blur-sm pointer-events-none"
            />
            
            <Fireworks />

            {/* Fireworks Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-8 right-8 z-[70] p-3 text-white/50 hover:text-white transition-colors"
              onClick={() => setIsFireworksActive(false)}
            >
              <X className="w-6 h-6 stroke-1" />
            </motion.button>

            {/* New Year Text with "Writing" Animation */}
            <div className="fixed inset-0 z-[65] flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                /* FIX: Moved exit transition from the transition prop to the exit prop's transition field to resolve TS error */
                exit={{ 
                  opacity: 0, 
                  scale: 0.95,
                  transition: { duration: 0.3 }
                }}
                transition={{ 
                  duration: 1.2, 
                  ease: "circOut"
                }}
                className="text-center"
              >
                <motion.h2 
                  className="serif italic text-4xl md:text-6xl lg:text-7xl text-white font-light tracking-wide shadow-black drop-shadow-lg"
                >
                  {["Happy", "New", "Year", "2026"].map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ delay: 0.3 + i * 0.15, duration: 1 }}
                      className="inline-block mx-2"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h2>
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "60px", opacity: 0.5 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="h-[1px] bg-white mx-auto mt-6"
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomeView lang={lang} />} />
            <Route path="/articles" element={<ArticlesView lang={lang} />} />
            <Route path="/articles/:id" element={<ArticleDetailView lang={lang} />} />
            <Route path="/links" element={<LinksView lang={lang} />} />
            <Route path="/about" element={<AboutView lang={lang} />} />
            <Route path="*" element={<HomeView lang={lang} />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </div>
  );
};

export default App;