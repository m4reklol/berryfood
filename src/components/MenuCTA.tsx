import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Utensils, ArrowRight } from 'lucide-react';

const MenuCTA = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-r from-[var(--color-primary)] via-[#2A1F15] to-[var(--color-primary)] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-20 w-32 h-32 bg-[var(--color-accent)] rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-20 w-40 h-40 bg-[var(--color-sage)] rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[var(--color-accent)]/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Utensils className="w-8 h-8 text-[var(--color-accent)]" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
          {t('menuCta.title')}
        </h2>

        {/* Subtitle */}
        <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('menuCta.subtitle')}
        </p>

        {/* CTA Button — stejné chování jako ve „Final CTA“ */}
        <Link
          to="/menu"
          aria-label="Prohlédnout menu"
          className="group relative isolate inline-flex items-center space-x-3 px-8 py-4 bg-[var(--color-accent)] text-white font-semibold text-lg tracking-wider uppercase rounded-full overflow-hidden transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/40"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4A574] to-[#B8954F] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
          <span className="relative z-10">{t('cta.viewMenu')}</span>
          <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default MenuCTA;
