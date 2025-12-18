import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Footer } from '../components/Footer';
import { projectsData } from '../data/projects';
import { Language } from '../types';

const ProjectsView: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      /* Reduced top padding on mobile */
      className="min-h-screen pt-28 md:pt-40 px-6 max-w-3xl mx-auto flex flex-col"
    >
      <h2 className="serif text-3xl text-center mb-12 md:mb-16 text-neutral-800 dark:text-neutral-100 font-light">
        {lang === 'zh' ? '个人项目' : 'Projects'}
      </h2>
      <div className="grid gap-12">
        {projectsData.map((project) => (
          <a 
            key={project.id} 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-gray-100 dark:border-neutral-800 pb-8 group-hover:border-gray-300 dark:group-hover:border-neutral-600 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="serif text-xl text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <ExternalLink className="w-3 h-3 text-gray-300 dark:text-neutral-600 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                  {lang === 'zh' ? project.descriptionCN : project.descriptionEN}
                </p>
              </div>
              {/* Increased font size from text-[10px] to text-sm */}
              <span className="mt-4 md:mt-0 text-sm tracking-widest text-gray-300 dark:text-neutral-600 font-mono">
                {project.year}
              </span>
            </div>
          </a>
        ))}
      </div>
      <div className="flex-grow"></div>
      <Footer className="mt-16" />
    </motion.div>
  );
};

export default ProjectsView;