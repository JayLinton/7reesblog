import React from 'react';

export const Footer: React.FC<{ className?: string }> = ({ className }) => (
  <footer className={`w-full text-center py-4 ${className}`}>
    <p className="text-[10px] tracking-widest text-gray-400 dark:text-neutral-600 opacity-80">
      &copy; {new Date().getFullYear()} 7REES. ALL RIGHTS RESERVED.
    </p>
  </footer>
);