import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8F5F0] via-white to-[#F5F1EB] -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-accent)]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--color-sage)]/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* O NÁS Section */}
        <div className="text-center mb-20 lg:mb-32">
          {/* Main Heading */}
          <div className="mb-12 lg:mb-16">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-semibold text-[var(--color-primary)] mb-6 font-['Montserrat']">
              {t('about.title')}
            </h2>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
            </div>
          </div>

          {/* Content in elegant card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100 relative overflow-hidden">
              {/* Subtle decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-accent)]/10 to-transparent rounded-bl-full"></div>
              
              <div className="relative z-10 space-y-6 lg:space-y-8 text-lg lg:text-xl text-[var(--color-text)] leading-relaxed font-['Montserrat']">
                <p>
                  {t('about.text1')}
                </p>
                
                <p>
                  {t('about.text2')}
                </p>
                
                <p>
                  {t('about.text3')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NÁŠ TÝM Section */}
        <div className="relative">
          {/* Background accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[#E8DDD0] to-[var(--color-bg)] rounded-3xl transform -skew-y-1 -z-10"></div>
          
          <div className="relative z-20 py-16 lg:py-20">
            <div className="text-center mb-12 lg:mb-16">
              <h3 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-[var(--color-primary)] mb-6 font-['Montserrat']">
                {t('about.team')}
              </h3>
              <div className="flex justify-center mb-8">
                <div className="w-20 h-1 bg-gradient-to-r from-[var(--color-sage)] to-[var(--color-accent)] rounded-full"></div>
              </div>
              
              <p className="text-lg lg:text-xl text-[var(--color-text)] max-w-2xl mx-auto leading-relaxed font-['Montserrat']">
                {t('about.teamSubtitle')}
              </p>
            </div>

            {/* Single Team Photo */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl p-3 sm:p-6 lg:p-8 shadow-lg">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="/nastym.webp"
                    alt="Náš tým Berry Food"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;