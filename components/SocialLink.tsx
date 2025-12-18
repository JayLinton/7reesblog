import React from 'react';
import { SocialLink as SocialLinkType } from '../types';

export const SocialLinkItem: React.FC<SocialLinkType> = ({ name, url, icon }) => {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex flex-col items-center justify-center p-4 transition-all duration-300 hover:scale-110"
      aria-label={name}
    >
      {/* Reduced size by approx 10% from w-8 (32px) to w-7 (28px) */}
      <div className="w-7 h-7 text-neutral-800 dark:text-neutral-200 transition-colors duration-300 group-hover:text-black dark:group-hover:text-white">
        {icon}
      </div>
      <span className="mt-2 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 text-neutral-600 dark:text-neutral-400">
        {name}
      </span>
    </a>
  );
};