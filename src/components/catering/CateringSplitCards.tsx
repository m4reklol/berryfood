import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Building2, ArrowRight } from 'lucide-react';

const CateringSplitCards = () => {
  const { t } = useTranslation();
  
  const cards = [
    {
      id: 'svatby',
      title: t('cateringSplitCards.wedding.title'),
      excerpt: t('cateringSplitCards.wedding.excerpt'),
      icon: Users,
      link: '/catering/svatby',
      image: '/herosvatebnicatering.avif'
    },
    {
      id: 'firemni',
      title: t('cateringSplitCards.corporate.title'),
      excerpt: t('cateringSplitCards.corporate.excerpt'),
      icon: Building2,
      link: '/catering/firemni',
      image: '/herofiremnicatering.avif'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col"
          >
            {/* Image Section with Hover Animation */}
            <div className="relative h-56 lg:h-64 overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-105"
                loading="lazy"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/5"></div>
              
              {/* Icon Badge */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
                <IconComponent className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-8 lg:p-10 flex flex-col flex-1">
              <h3 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-4 leading-tight">
                {card.title}
              </h3>
              
              <p className="text-lg text-[var(--color-text)]/80 leading-relaxed mb-8 font-light flex-1">
                {card.excerpt}
              </p>
              
              {/* Simple CTA Link */}
              <div className="mt-auto">
                <Link
                  to={card.link}
                  className="inline-flex items-center space-x-2 text-[var(--color-accent)] font-semibold text-lg hover:text-[#B8954F] transition-colors duration-200"
                >
                  <span>{t('cateringSplitCards.wedding.cta')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CateringSplitCards;