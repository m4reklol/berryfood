import React from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Clock, Users, CheckCircle, Phone, CreditCard, Shield, Monitor, ArrowRight } from 'lucide-react';
import Spoluprace from '../components/Spoluprace';
import ContactForm from '../components/ContactForm';
import SEOHead from '../components/SEOHead';

const Rozvoz = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead pageKey="delivery" />
      <div className="min-h-screen bg-[var(--color-bg)]">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden min-h-[70vh] flex items-center">
          {/* Background Media */}
          <div className="absolute inset-0 w-full h-full z-0">
            <video
              className="w-full h-full object-cover object-center"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/herorozvoz.avif" // fallback still-frame while video buffers
            >
              <source src="/herorozvoz.webm" type="video/webm" />
            </video>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-1"></div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-accent)]/20 rounded-full blur-3xl z-5"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--color-sage)]/20 rounded-full blur-3xl z-5"></div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              {/* Hero Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <Truck className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
                {t('rozvoz.hero.title')}<br />
                <span className="text-[var(--color-accent)] drop-shadow-lg">{t('rozvoz.hero.subtitle')}</span>
              </h1>

              {/* CTA Button */}
              <a 
                href="https://www.lunchdrive.cz/cs/d/berryfood"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-[var(--color-accent)] text-white font-semibold text-lg tracking-wider uppercase rounded-full transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/40 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {t('rozvoz.cta.orderDelivery')}
                </span>
                <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#B8954F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </section>

        {/* Proč rozvoz Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-[#F8F5F0] to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-8 leading-tight">
                {t('rozvoz.sections.whyDelivery')}<br />
                <span className="text-[var(--color-accent)]">{t('rozvoz.sections.whyDeliverySubtitle')}</span>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Content Card */}
              <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100 mb-12">
                <div className="space-y-6 text-lg lg:text-xl text-[var(--color-text)] leading-relaxed">
                  <p>
                    {t('rozvoz.content.text1')}
                  </p>
                  <p>
                    {t('rozvoz.content.text2')}
                  </p>
                </div>
              </div>

              {/* Special Note Badge */}
              <div className="bg-gradient-to-r from-[var(--color-accent)] to-[#B8954F] rounded-3xl p-8 lg:p-12 text-white text-center mb-12 shadow-xl">
                <div className="space-y-4">
                  <h3 className="text-2xl lg:text-3xl font-bold tracking-wider uppercase">
                    {t('rozvoz.sections.noCommission')}
                  </h3>
                  <p className="text-lg lg:text-xl opacity-90 leading-relaxed">
                    {t('rozvoz.sections.noCommissionSubtitle')}
                  </p>
                </div>
              </div>

              {/* Secondary CTA */}
              <div className="text-center">
                <a 
                  href="https://www.lunchdrive.cz/cs/d/berryfood"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-[var(--color-primary)] text-white font-semibold text-lg tracking-wider uppercase rounded-full transition-all duration-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 shadow-lg hover:shadow-2xl hover:shadow-[var(--color-primary)]/60 relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {t('rozvoz.cta.orderDelivery')}
                  </span>
                  <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4A3426] to-[#2F1F16] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Jak to funguje Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-6">
                {t('rozvoz.sections.howItWorks')}
              </h2>
              <div className="flex justify-center">
                <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
              </div>
            </div>

            {/* Steps */}
            <div className="max-w-5xl mx-auto mb-16">
              <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-lg border border-gray-100">
                {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
                  <div key={stepNumber} className={`flex items-start space-x-6 lg:space-x-8 hover:bg-gray-50/50 transition-colors duration-200 rounded-lg p-4 lg:p-6 ${stepNumber < 6 ? 'border-b border-gray-100 pb-6 mb-6' : ''}`}>
                    {/* Step Number */}
                    <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center font-bold text-lg lg:text-xl self-start">
                      {stepNumber}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 pt-2">
                      <p className="text-lg lg:text-xl text-[var(--color-text)] leading-relaxed font-medium">
                        {stepNumber === 1 ? (
                          <>
                            {t('rozvoz.steps.step1.beforeLink')}{' '}
                            <a
                              href="https://www.lunchdrive.cz/cs/d/berryfood"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--color-accent)] font-semibold underline hover:no-underline transition-all duration-200"
                            >
                              {t('rozvoz.steps.step1.linkText')}
                            </a>
                            {t('rozvoz.steps.step1.afterLink')}
                          </>
                        ) : stepNumber === 2 ? (
                          <>
                            {t('rozvoz.steps.step2.beforeHighlight')}{' '}
                            <span className="text-[var(--color-accent)] font-semibold">
                              {t('rozvoz.steps.step2.highlightText')}
                            </span>
                            {t('rozvoz.steps.step2.afterHighlight')}
                          </>
                        ) : stepNumber === 3 ? (
                          t('rozvoz.steps.step3.text')
                        ) : stepNumber === 4 ? (
                          t('rozvoz.steps.step4.text')
                        ) : stepNumber === 5 ? (
                          <>
                            {t('rozvoz.steps.step5.beforeHighlight')}{' '}
                            <span className="text-[var(--color-accent)] font-semibold">
                              {t('rozvoz.steps.step5.highlightText')}
                            </span>
                            {t('rozvoz.steps.step5.afterHighlight')}
                          </>
                        ) : (
                          t('rozvoz.steps.step6.text')
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features List */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-lg border border-gray-100">
                <div className="grid gap-6 lg:gap-8">
                  {[
                    { icon: CreditCard, key: 'invoicePayment' },
                    { icon: Shield, key: 'priceVisibility' },
                    { icon: Users, key: 'roleAssignment' },
                    { icon: Monitor, key: 'physicalTerminal' }
                  ].map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <div key={index} className="flex items-start space-x-6 lg:space-x-8">
                        <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-[var(--color-sage)]/10 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--color-sage)]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-base lg:text-lg text-[var(--color-text)]/80 leading-relaxed">
                            {t(`rozvoz.features.${feature.key}`)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="text-center">
              <a 
                href="https://www.lunchdrive.cz/cs/d/berryfood"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-[var(--color-accent)] text-white font-semibold text-lg tracking-wider uppercase rounded-full transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/40 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {t('rozvoz.cta.orderDelivery')}
                </span>
                <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#B8954F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F8F5F0] via-white to-[#F5F1EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ContactForm />
          </div>
        </section>

        {/* Spolupráce Section */}
        <Spoluprace />
      </div>
    </>
  );
};

export default Rozvoz;