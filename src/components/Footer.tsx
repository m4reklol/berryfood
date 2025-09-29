import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Clock, MapPin, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-primary)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-x-clip">
        {/* 1 -> 3 columns až od 832px */}
        <div className="grid grid-cols-1 min-[832px]:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Bistro BUDEX Column */}
          <div className="space-y-4 min-w-0">
            <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider">{t('footer.bistroBudex')}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 min-w-0">
                <Mail className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                <a
                  href="mailto:budex@berryfood.cz"
                  className="text-white/90 hover:text-white transition-colors duration-200 hover:underline flex-1 min-w-0 max-w-full break-words [overflow-wrap:anywhere] whitespace-normal"
                >
                  budex@berryfood.cz
                </a>
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <Phone className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                <a
                  href="tel:+420774115898"
                  className="text-white/90 hover:text-white transition-colors duration-200 hover:underline flex-1 min-w-0 max-w-full break-words [overflow-wrap:anywhere] whitespace-normal"
                >
                  774 115 898
                </a>
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <Clock className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                <span className="text-white/90 flex-1 min-w-0 max-w-full break-words [overflow-wrap:anywhere] whitespace-normal">
                  7:30 — 15:00
                </span>
              </div>

              <div className="flex items-start gap-3 min-w-0">
                <MapPin className="w-5 h-5 mt-1 text-[var(--color-accent)] flex-shrink-0" />
                <a
                  href="https://maps.google.com/?q=Planá+67,+370+01+České+Budějovice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white transition-colors duration-200 hover:underline flex-1 min-w-0 max-w-full break-words [overflow-wrap:anywhere] whitespace-normal"
                >
                  <address className="not-italic">
                    Planá 67<br />
                    370 01 České Budějovice
                  </address>
                </a>
              </div>
            </div>
          </div>

          {/* Bistro Plynárna Column */}
          <div className="space-y-4 min-w-0">
            <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider">{t('footer.bistroPlynarna')}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 min-w-0">
                <Mail className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                <a
                  href="mailto:info@berryfood.cz"
                  className="text-white/90 hover:text-white transition-colors duration-200 hover:underline flex-1 min-w-0 max-w-full break-words [overflow-wrap:anywhere] whitespace-normal"
                >
                  info@berryfood.cz
                </a>
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <Phone className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                <a
                  href="tel:+420774488114"
                  className="text-white/90 hover:text-white transition-colors duration-200 hover:underline flex-1 min-w-0 max-w-full break-words [overflow-wrap:anywhere] whitespace-normal"
                >
                  774 488 114
                </a>
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <Clock className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                <span className="text-white/90 flex-1 min-w-0 max-w-full break-words [overflow-wrap:anywhere] whitespace-normal">
                  7:30 — 13:30
                </span>
              </div>

              <div className="flex items-start gap-3 min-w-0">
                <MapPin className="w-5 h-5 mt-1 text-[var(--color-accent)] flex-shrink-0" />
                <a
                  href="https://maps.google.com/?q=Vrbenská+2/2b,+370+01+České+Budějovice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white transition-colors duration-200 hover:underline flex-1 min-w-0 max-w-full break-words [overflow-wrap:anywhere] whitespace-normal"
                >
                  <address className="not-italic">
                    Vrbenská 2/2b<br />
                    370 01 České Budějovice
                  </address>
                </a>
              </div>
            </div>
          </div>

          {/* Fakturační údaje Column */}
          <div className="space-y-4 min-w-0">
            <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider">{t('footer.billingInfo')}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 min-w-0">
                <Mail className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                <a
                  href="mailto:fakturace@berryfood.cz"
                  className="text-white/90 hover:text-white transition-colors duration-200 hover:underline flex-1 min-w-0 max-w-full break-words [overflow-wrap:anywhere] whitespace-normal"
                >
                  fakturace@berryfood.cz
                </a>
              </div>

              <div className="text-white/90 space-y-2 min-w-0">
                <p className="font-medium">{t('footer.companyName')}</p>
                <p>IČ: 11944447</p>
                <p>DIČ: CZ11944447</p>

                <address className="not-italic mt-4">
                  Třebotovice 2484<br />
                  České Budějovice 5<br />
                  370 06 České Budějovice
                </address>

                <p className="text-sm mt-4 text-white/60">
                  {t('footer.registryNote')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Logo and Social Media */}
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
              <img
                src="/berryfoodpngwhite.png"
                alt="Berry Food"
                className="h-16 lg:h-20 w-auto"
              />

              {/* Social Media Icons */}
              <div className="flex items-center space-x-4">
                <a
                  href="https://www.instagram.com/berry_food_catering/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://www.facebook.com/berryfoodcatering"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Copyright and Links */}
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6 text-center lg:text-right">
              <div className="text-white/60 text-sm">
                {t('footer.copyright', { year: currentYear })}
              </div>
              <div className="flex space-x-6 text-sm">
                <button
                  onClick={() => {
                    const event = new CustomEvent('open-cookie-preferences');
                    window.dispatchEvent(event);
                  }}
                  className="text-white/60 hover:text-white transition-colors duration-200 hover:underline"
                >
                  {t('footer.cookies')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
