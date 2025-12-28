import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DotMatrixImage } from '../components/DotMatrixImage';
import { SocialLinkItem } from '../components/SocialLink';
import { Footer } from '../components/Footer';
import { GithubIcon, MailIcon, SteamIcon } from '../components/Icons';
import { SocialLink, Language } from '../types';

const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/JayLinton', icon: <GithubIcon className="w-full h-full" /> },
  { name: 'Steam', url: 'https://steamcommunity.com/profiles/76561198319154640/', icon: <SteamIcon className="w-full h-full" /> },
  { name: 'Email', url: 'mailto:1063750098@qq.com', icon: <MailIcon className="w-full h-full" /> },
];

const Section: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({ id, children, className }) => (
  <section id={id} className={`h-[100dvh] w-full snap-start shrink-0 overflow-hidden relative flex flex-col items-center justify-center ${className}`}>
    {children}
  </section>
);

const HomeView: React.FC<{ lang: Language }> = ({ lang }) => {
  const profileRef = useRef(null);
  const isProfileInView = useInView(profileRef, { once: false, amount: 0.3 });
  const navigate = useNavigate();

  const scrollToProfile = () => {
    const profileSection = document.getElementById('profile');
    profileSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="snap-y snap-mandatory h-full overflow-y-scroll no-scrollbar scroll-smooth"
    >
      {/* Hero Section */}
      <Section id="home" className="relative">
        <div className="relative flex items-center justify-center w-full h-full overflow-hidden px-6">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 w-full flex justify-center"
          >
            <div className="relative w-full max-w-xl">
              <DotMatrixImage 
                src="https://s2.loli.net/2025/12/27/4ghfLaSq3H7UPie.webp" 
                className="w-full"
              />
              <span className="absolute -bottom-8 left-0 text-[10px] tracking-[0.2em] text-gray-500 dark:text-gray-400 font-light uppercase">
                Tsingtao's Sea
              </span>
              <span className="absolute -bottom-8 right-0 text-[10px] tracking-[0.2em] text-gray-400 dark:text-gray-500 opacity-50 font-light uppercase">
                7rees@2025
              </span>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} 
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 w-full flex flex-col items-center justify-center cursor-pointer z-30 group"
          onClick={scrollToProfile}
        >
          <span className="text-xs tracking-widest opacity-50 mb-2 text-neutral-800 dark:text-neutral-200 group-hover:opacity-100 transition-opacity">SCROLL</span>
          <ChevronDown className="w-4 h-4 opacity-40 text-neutral-800 dark:text-neutral-200 group-hover:opacity-80 transition-opacity" />
        </motion.div>
      </Section>

      {/* Profile Section */}
      <Section id="profile" className="relative">
        <div ref={profileRef} className="flex flex-col items-center max-w-2xl px-6 text-center z-10 flex-grow justify-center">
          <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={isProfileInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="mb-8"
          >
            <div 
              className="cursor-pointer group"
              onClick={() => navigate('/articles/aboutme')}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-100 dark:border-neutral-800 shadow-sm mx-auto mb-6 bg-gray-50 dark:bg-neutral-900 transition-transform duration-500">
                 <img src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAENIntpQ-d_KUk_d1zunZPb9kqOmPtXHgACWDcAAjgIIFbVnCofqV4kczYE.jpg" alt="Avatar" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div 
                className="inline-block cursor-pointer group/name"
                onClick={() => navigate('/articles/aboutme')}
              >
              <h2 className="font-sans font-bold text-3xl md:text-4xl mb-2 tracking-wide text-neutral-900 dark:text-neutral-100 transition-colors relative">
                7rees
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-neutral-800 dark:bg-neutral-200 origin-left scale-x-0 group-hover/name:scale-x-100 transition-transform duration-300 ease-out" />
              </h2>
              </div>
            </div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 mb-8 font-light">
              {lang === 'zh' ? '独立开发者' : 'Independent developer'}
            </p>
            <p className="font-light text-gray-600 dark:text-gray-300 leading-relaxed mb-12 max-w-md mx-auto">
              {lang === 'zh' 
                ? '除了死亡这一唯一的宿命，世间一切，无论是欢愉还是幸福，皆是自由。' 
                : 'Hors de cette seule fatalité que est la mort, tout, bonheur or joie, est liberté.'}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={isProfileInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex gap-12 items-center justify-center flex-wrap"
          >
            {socialLinks.map((link) => (
              <SocialLinkItem key={link.name} {...link} />
            ))}
          </motion.div>
        </div>
        <Footer className="absolute bottom-2" lang={lang} />
      </Section>
    </motion.div>
  );
};

export default HomeView;