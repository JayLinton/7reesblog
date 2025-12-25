import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'HOME', path: '/', value: 'home' },
  { label: 'ARTICLES', path: '/articles', value: 'articles' },
  { label: 'LINKS', path: '/links', value: 'links' },
  { label: 'ABOUT', path: '/about', value: 'about' }
];

export const Navbar: React.FC = () => {
  const location = useLocation();

  const getActiveState = (path: string) => {
    // Exact match for home
    if (path === '/' && location.pathname === '/') return true;
    // Prefix match for other sections
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-center py-6 md:py-8 bg-[#fafafa]/85 dark:bg-[#111111]/85 backdrop-blur-sm pointer-events-none transition-all duration-300">
      <ul className="flex gap-6 md:gap-56 pointer-events-auto">
        {navItems.map((item) => {
          const isActive = getActiveState(item.path);
          return (
            <li key={item.label}>
              <Link
                to={item.path}
                className={`text-xs tracking-[0.2em] transition-all duration-500 font-light hover:opacity-50 
                  ${isActive 
                    ? 'text-black dark:text-neutral-100 font-normal opacity-100' 
                    : 'text-neutral-600 dark:text-neutral-400 opacity-50'}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};