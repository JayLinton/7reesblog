import React, { useState } from 'react';

interface DotMatrixImageProps {
  src: string;
  className?: string;
}

export const DotMatrixImage: React.FC<DotMatrixImageProps> = ({ src, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 
        使用 CSS Mask 实现点阵效果 
        radial-gradient 创建圆形点阵
        mask-size 控制点的大小和密度
        移除 grayscale 以保留色彩，保留 contrast-125 增强清晰度
      */}
      <div 
        className={`transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          maskImage: 'radial-gradient(circle, black 1.5px, transparent 2px)',
          maskSize: '4px 4px',
          WebkitMaskImage: 'radial-gradient(circle, black 1.5px, transparent 2px)',
          WebkitMaskSize: '4px 4px',
        }}
      >
        <img 
          src={src} 
          alt="Artistic Representation" 
          className="w-full h-auto object-contain filter contrast-125 block"
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};