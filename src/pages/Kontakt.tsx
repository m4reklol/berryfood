import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Clock, MapPin, Instagram, Facebook, Building2, FileText } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import FAQ from '../components/FAQ';
import SEOHead from '../components/SEOHead';

const Kontakt = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEOHead pageKey="contact" />
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/nastym.webp"
            alt="Kontakt Berry Food"
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
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <Mail className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
              {t('pages.contact.hero.title')}
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              {t('pages.contact.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Bistros Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
            
            {/* Bistro BUDEX */}
            <div className="bg-white">
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-4 uppercase">
                  {t('footer.bistroBudex')}
                </h2>
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-[var(--color-accent)] rounded-full"></div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <a
                      href="mailto:budex@berryfood.cz"
                      className="text-lg text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                      budex@berryfood.cz
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <a
                      href="tel:+420774115898"
                      className="text-lg text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                      774 115 898
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <span className="text-lg text-[var(--color-primary)]">7:30 — 15:00</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <a
                      href="https://maps.google.com/?q=Planá+67,+370+01+České+Budějovice"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                      <address className="not-italic">
                        Planá 67<br />
                        370 01 České Budějovice
                      </address>
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Maps for BUDEX */}
              <div className="bg-white rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2569.8!2d14.4747!3d48.9685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b4f8b8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2zUGxhbsOhIDY3LCAzNzAgMDEgxIxlc2vDqSBCdWTEm2pvdmljZQ!5e0!3m2!1scs!2scz!4v1234567890"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa Bistro BUDEX"
                ></iframe>
              </div>
            </div>

            {/* Bistro Plynárna */}
            <div className="bg-white">
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-4 uppercase">
                  {t('footer.bistroPlynarna')}
                </h2>
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-[var(--color-accent)] rounded-full"></div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <a
                      href="mailto:info@berryfood.cz"
                      className="text-lg text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                      info@berryfood.cz
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <a
                      href="tel:+420774488114"
                      className="text-lg text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                      774 488 114
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <span className="text-lg text-[var(--color-primary)]">7:30 — 13:30</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <a
                      href="https://maps.google.com/?q=Vrbenská+2/2b,+370+01+České+Budějovice"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                      <address className="not-italic">
                        Vrbenská 2/2b<br />
                        370 01 České Budějovice
                      </address>
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Maps for Plynárna */}
              <div className="bg-white rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2569.5!2d14.4658!3d48.9742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b4f8b8b8b8b8c%3A0x8b8b8b8b8b8b8b8c!2zVnJiZW5za8OhIDIvMmIsIDM3MCAwMSDEjGVza8OpIEJ1ZMSbam92aWNl!5e0!3m2!1scs!2scz!4v1234567891"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa Bistro Plynárna"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Company Information Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Fakturační údaje */}
            <div className="bg-white rounded-3xl p-8 lg:p-10">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[var(--color-sage)]/10 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-[var(--color-sage)]" />
                  </div>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-4">
                  {t('pages.contact.sections.billingInfo')}
                </h2>
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-[var(--color-sage)] rounded-full"></div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <a
                      href="mailto:fakturace@berryfood.cz"
                      className="text-lg text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                      fakturace@berryfood.cz
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Building2 className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-lg font-semibold text-[var(--color-primary)]">{t('footer.companyName')}</p>
                      <p className="text-base text-[var(--color-primary)]/80">IČ: 11944447</p>
                      <p className="text-base text-[var(--color-primary)]/80">DIČ: CZ11944447</p>
                    </div>
                    
                    <address className="not-italic text-base text-[var(--color-primary)]/80">
                      Třebotovice 2484<br />
                      České Budějovice 5<br />
                      370 06 České Budějovice
                    </address>
                    
                    <p className="text-sm text-[var(--color-primary)]/60 leading-relaxed">
                      {t('footer.registryNote')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media & General Contact */}
            <div className="bg-white rounded-3xl p-8 lg:p-10">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[var(--color-sage)]/10 rounded-full flex items-center justify-center">
                    <Instagram className="w-8 h-8 text-[var(--color-sage)]" />
                  </div>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-4">
                  {t('pages.contact.sections.followUs')}
                </h2>
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-[var(--color-sage)] rounded-full"></div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Social Media Links */}
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <a
                    href="https://www.instagram.com/berry_food_catering/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto min-w-[160px]"
                  >
                    <Instagram className="w-6 h-6" />
                    <span className="font-medium">Instagram</span>
                  </a>
                  
                  <a
                    href="https://www.facebook.com/berryfoodcatering"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-3 px-6 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto min-w-[160px]"
                  >
                    <Facebook className="w-6 h-6" />
                    <span className="font-medium">Facebook</span>
                  </a>
                </div>

                {/* General Contact Info */}
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">
                    {t('pages.contact.sections.generalQuestions')}
                  </h3>
                  <div className="flex justify-center">
                    <a
                      href="mailto:info@berryfood.cz"
                      className="flex items-center space-x-3 text-lg text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                      <Mail className="w-5 h-5" />
                      <span>info@berryfood.cz</span>
                    </a>
                  </div>
                </div>

                {/* Logo */}
                <div className="flex justify-center pt-6">
                  <img 
                    src="/berryfoodpngblack.png" 
                    alt="Berry Food" 
                    className="h-24 w-auto opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Form Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F8F5F0] via-white to-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Kontakt;