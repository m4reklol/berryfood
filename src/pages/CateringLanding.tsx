import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChefHat, Users, Utensils, ArrowRight, X, UtensilsCrossed } from 'lucide-react';
import SubpageHero from '../components/catering/SubpageHero';
import CateringSplitCards from '../components/catering/CateringSplitCards';
import CateringCategoryGallery from '../components/catering/CateringCategoryGallery';
import CateringLeadModal from '../components/catering/CateringLeadModal';
import SectionSeparator from '../components/catering/SectionSeparator';
import SEOHead from '../components/SEOHead';

const CateringLanding = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  // Handle hash changes for smooth scrolling
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  const workingPrinciples = [
    {
      title: 'LOKÁLNOST',
      description: 'Klademe důraz na lokální odběr surovin',
      icon: '🌱'
    },
    {
      title: 'SEZÓNNOST',
      description: 'Využíváme sezónní potraviny pro nejlepší chuť',
      icon: '🍂'
    },
    {
      title: 'PRECIZNOST',
      description: 'Preciznost podávaných pokrmů se odvíjí od příběhu surovin',
      icon: '✨'
    },
    {
      title: 'SERVIS',
      description: 'Připravujeme „uměleckou výstavu" dobrot podle vašich požadavků',
      icon: '🎯'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEOHead pageKey="catering" />
      
      {/* Hero Section */}
      <SubpageHero
        title={t('pages.catering.hero.title')}
        subtitle={t('pages.catering.hero.subtitle')}
        imagePlaceholder="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1920"
        imagePlaceholder="/herocatering.avif"
        ctaText={t('cta.requestCatering')}
        onCtaClick={openModal}
        icon={UtensilsCrossed}
      />

      {/* Split Cards Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CateringSplitCards />
        </div>
      </section>

      <SectionSeparator />

      {/* Tabs Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-[#F8F5F0] to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-8 leading-tight">
              {t('pages.catering.sections.specialization')}
            </h2>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
            </div>
          </div>

          <CateringCategoryGallery />
        </div>
      </section>

      <SectionSeparator />

      {/* How We Work Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F8F5F0] via-white to-[#F5F1EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-8 leading-tight">
              {t('pages.catering.sections.howWeWork')}
            </h2>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
            </div>
            <div className="max-w-4xl mx-auto mt-8">
              <div className="text-lg lg:text-xl text-[var(--color-text)] leading-relaxed space-y-6">
                {t('workingPrinciples.description').split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: t('workingPrinciples.locality.title'),
                description: t('workingPrinciples.locality.description'),
                icon: '🌱'
              },
              {
                title: t('workingPrinciples.uniqueness.title'),
                description: t('workingPrinciples.uniqueness.description'),
                icon: '✨'
              },
              {
                title: t('workingPrinciples.precision.title'),
                description: t('workingPrinciples.precision.description'),
                icon: '🎯'
              },
              {
                title: t('workingPrinciples.service.title'),
                description: t('workingPrinciples.service.description'),
                icon: '🍽️'
              }
            ].map((principle, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-accent)]/5 to-transparent rounded-bl-full"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-6">{principle.icon}</div>
                  <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4 tracking-wider">
                    {principle.title}
                  </h3>
                  <p className="text-base text-[var(--color-text)]/80 leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-[var(--color-primary)] via-[#2A1F15] to-[var(--color-primary)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-32 h-32 bg-[var(--color-accent)] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-[var(--color-sage)] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[var(--color-accent)]/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-[var(--color-accent)]" />
            </div>
          </div>
          
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
            {t('pages.catering.sections.finalCta')}
          </h2>
          
          <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('pages.catering.sections.finalCtaSubtitle')}
          </p>
          
          <button
            onClick={openModal}
            className="group relative isolate inline-flex items-center space-x-3 px-8 py-4 bg-[var(--color-accent)] text-white font-semibold text-lg tracking-wider uppercase rounded-full overflow-hidden transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/40"
          >
            <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 bg-gradient-to-r from-[#D4A574] to-[#B8954F] group-hover:opacity-100" />
            <span className="relative z-10">{t('cta.requestCatering')}</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </section>

      {/* Lead Modal */}
      <CateringLeadModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default CateringLanding;