import React from 'react';
import { ArrowRight, DivideIcon as LucideIcon } from 'lucide-react';

interface SubpageHeroProps {
  title: string;
  subtitle?: string;
  imagePlaceholder: string;
  ctaText?: string;
  onCtaClick?: () => void;
  icon?: LucideIcon;
}

const SubpageHero: React.FC<SubpageHeroProps> = ({
  title,
  subtitle,
  imagePlaceholder,
  ctaText,
  onCtaClick,
  icon: Icon
}) => {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden min-h-[70vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={imagePlaceholder}
          alt={title}
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-1"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-accent)]/20 rounded-full blur-3xl z-5"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--color-sage)]/20 rounded-full blur-3xl z-5"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          {/* Hero Icon */}
          {Icon && (
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <Icon className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>
          )}

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg mb-12">
              {subtitle}
            </p>
          )}

          {ctaText && onCtaClick && (
            <button
              onClick={onCtaClick}
              className="inline-flex items-center px-8 py-4 bg-[var(--color-accent)] text-white font-semibold text-lg tracking-wider uppercase rounded-full transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/40 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {ctaText}
              </span>
              <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#B8954F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SubpageHero;