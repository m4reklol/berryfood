import React from 'react';
import { useTranslation } from 'react-i18next';

const Spoluprace = () => {
  const { t } = useTranslation();

  const partners = [
    {
      name: 'EGD',
      logo: '/logoegd.webp'
    },
    {
      name: 'EON',
      logo: '/logoeon.webp'
    },
    {
      name: 'BUDEX',
      logo: '/logobudex.webp'
    },
    {
      name: 'Jihotech',
      logo: '/logojihotech.webp'
    },
    {
      name: 'Terms',
      logo: '/logoterms.webp'
    },
    {
      name: 'Viscofan',
      logo: '/logoviscofan.webp'
    },
    {
      name: 'Joch',
      logo: '/logojoch.webp'
    },
    {
      name: 'Milan Král',
      logo: '/logomilankral.webp'
    },
    {
      name: 'Swietelsky',
      logo: '/logoswietelsky.webp'
    },
    {
      name: 'Toyota Dolák',
      logo: '/logotoyotadolak.webp'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-6">
            {t('collaboration.title')}
          </h2>
          <div className="flex justify-center mb-8">
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10 items-center justify-items-center place-content-center">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28"
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          
          {/* Custom CSS for centering incomplete last row */}
          <style jsx>{`
            @media (min-width: 640px) and (max-width: 767px) {
              /* 3 columns: 10 items = 3+3+3+1, center the last item */
              .grid > div:nth-child(10) {
                grid-column: 2;
              }
            }
            
            @media (min-width: 768px) and (max-width: 1023px) {
              /* 4 columns: 10 items = 4+4+2, center the last 2 items */
              .grid > div:nth-child(9) {
                grid-column: 2;
              }
              .grid > div:nth-child(10) {
                grid-column: 3;
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default Spoluprace;