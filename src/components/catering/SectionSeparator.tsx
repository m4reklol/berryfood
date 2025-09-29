import React from 'react';

const SectionSeparator = () => {
  return (
    <div className="relative py-8">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="relative">
            {/* Main gradient line */}
            <div className="h-[3px] bg-gradient-to-r from-transparent via-[var(--color-accent)] via-[var(--color-sage)] to-transparent rounded-full opacity-60"></div>
            
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Decorative dots */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex space-x-4">
          <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full opacity-40"></div>
          <div className="w-2 h-2 bg-[var(--color-sage)] rounded-full opacity-60"></div>
          <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full opacity-40"></div>
        </div>
      </div>
    </div>
  );
};

export default SectionSeparator;