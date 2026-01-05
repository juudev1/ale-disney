import React, { forwardRef } from 'react';

interface PageProps {
  children: React.ReactNode;
  variant?: 'cover' | 'default' | 'back';
  className?: string;
  number?: string; // Passed automatically by react-pageflip
}

export const Page = forwardRef<HTMLDivElement, PageProps>(({ children, variant = 'default', className = '' }, ref) => {
  
  // Base styles for all pages (paper texture simulation)
  const baseStyles = "w-full h-full bg-[#fdfbf7] shadow-lg relative overflow-hidden";
  
  // Variant specific styles
  const variantStyles = {
    default: "bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')] border-r border-[#d4c5b0]", // Inner page
    cover: "bg-blue-900 border-4 border-yellow-600 rounded-r-lg", // Front cover
    back: "bg-blue-900 border-4 border-yellow-600 rounded-l-lg",  // Back cover
  };

  const getStyle = () => {
    switch(variant) {
      case 'cover': return "bg-gradient-to-br from-blue-900 to-indigo-950 text-white";
      case 'back': return "bg-gradient-to-bl from-blue-900 to-indigo-950 text-white";
      default: return "bg-[#faf0e6] text-slate-800"; // Antique white
    }
  };

  return (
    <div className={`page ${baseStyles} ${getStyle()} ${className}`} ref={ref}>
      {/* Decorative Border for default pages */}
      {variant === 'default' && (
        <div className="absolute inset-4 border-2 border-yellow-900/20 border-double pointer-events-none rounded-sm"></div>
      )}
      
      {/* Page Content */}
      <div className="h-full w-full p-8 flex flex-col">
        {children}
      </div>
      
      {/* Page shine/shadow gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/10 pointer-events-none"></div>
    </div>
  );
});

Page.displayName = 'Page';
