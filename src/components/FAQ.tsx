import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQCategory {
  id: string;
  name: string;
  items: FAQItem[];
}

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqData: FAQCategory[] = [
    {
      id: 'catering',
      name: t('faq.categories.catering'),
      items: [
        {
          id: 'catering-advance',
          question: t('faq.items.cateringAdvance.question'),
          answer: t('faq.items.cateringAdvance.answer'),
          category: 'catering',
        },
        {
          id: 'catering-dietary',
          question: t('faq.items.cateringDietary.question'),
          answer: t('faq.items.cateringDietary.answer'),
          category: 'catering',
        },
        {
          id: 'catering-service',
          question: t('faq.items.cateringService.question'),
          answer: t('faq.items.cateringService.answer'),
          category: 'catering',
        },
      ],
    },
    {
      id: 'bistra',
      name: t('faq.categories.bistros'),
      items: [
        {
          id: 'bistro-reservation',
          question: t('faq.items.bistroReservation.question'),
          answer: t('faq.items.bistroReservation.answer'),
          category: 'bistra',
        },
        {
          id: 'bistro-hours',
          question: t('faq.items.bistroHours.question'),
          answer: t('faq.items.bistroHours.answer'),
          category: 'bistra',
        },
        {
          id: 'bistro-menu',
          question: t('faq.items.bistroMenu.question'),
          answer: t('faq.items.bistroMenu.answer'),
          category: 'bistra',
        },
      ],
    },
    {
      id: 'rozvoz',
      name: t('faq.categories.delivery'),
      items: [
        {
          id: 'delivery-area',
          question: t('faq.items.deliveryArea.question'),
          answer: t('faq.items.deliveryArea.answer'),
          category: 'rozvoz',
        },
        {
          id: 'delivery-time',
          question: t('faq.items.deliveryTime.question'),
          answer: t('faq.items.deliveryTime.answer'),
          category: 'rozvoz',
        },
        {
          id: 'delivery-fee',
          question: t('faq.items.deliveryFee.question'),
          answer: t('faq.items.deliveryFee.answer'),
          category: 'rozvoz',
        },
      ],
    },
  ];

  const toggleItem = (itemId: string) => {
    setOpenItem(openItem === itemId ? null : itemId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(itemId);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-[#F8F5F0] to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-sage)] rounded-full flex items-center justify-center shadow-lg">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-8 leading-tight">
            {t('pages.contact.sections.faq')}
          </h2>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full" />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqData.map((category) => (
            <div key={category.id}>
              {/* Category Header */}
              <div className="mb-6">
                <h3 className="text-xl lg:text-2xl font-bold text-[var(--color-primary)] uppercase tracking-wider text-center">
                  {category.name}
                </h3>
                <div className="flex justify-center mt-2">
                  <div className="w-16 h-1 bg-[var(--color-accent)] rounded-full" />
                </div>
              </div>

              {/* Category Items */}
              <div className="space-y-3">
                {category.items.map((item) => {
                  const isOpen = openItem === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
                        isOpen
                          ? 'border-2 border-[var(--color-accent)] shadow-xl bg-gradient-to-r from-[var(--color-accent)]/5 to-[var(--color-sage)]/5'
                          : 'border border-gray-100'
                      }`}
                    >
                      {/* Question Row: grid (text | icon) with unified horizontal padding */}
                      <button
                        onClick={() => toggleItem(item.id)}
                        onKeyDown={(e) => handleKeyDown(e, item.id)}
                        className={`w-full grid grid-cols-[1fr,2rem] items-center gap-4 pl-6 pr-6 py-4 text-left focus:outline-none transition-all duration-300 group ${
                          isOpen
                            ? 'bg-gradient-to-r from-[var(--color-accent)]/10 to-[var(--color-sage)]/10'
                            : 'hover:bg-gradient-to-r hover:from-[var(--color-accent)]/5 hover:to-[var(--color-sage)]/5'
                        }`}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${item.id}`}
                      >
                        <span
                          className={`text-base lg:text-lg font-medium leading-relaxed transition-colors duration-300 ${
                            isOpen
                              ? 'text-[var(--color-accent)] font-semibold'
                              : 'text-[var(--color-primary)] group-hover:text-[var(--color-accent)]'
                          }`}
                        >
                          {item.question}
                        </span>

                        <div
                          className={`justify-self-end w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isOpen
                              ? 'bg-[var(--color-accent)] shadow-md'
                              : 'bg-[var(--color-accent)]/10 group-hover:bg-[var(--color-accent)]/20'
                          }`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-all duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            } ${isOpen ? 'text-white' : 'text-[var(--color-accent)] group-hover:text-[var(--color-accent)] group-hover:scale-110'}`}
                          />
                        </div>
                      </button>

                      {/* Answer: same horizontal padding as question (pl/pr-6) so edges align */}
                      <div
                        id={`faq-answer-${item.id}`}
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="pl-6 pr-6 pb-4">
                          {/* Divider aligned to content width */}
                          <div className="border-t border-gray-100 pt-4">
                            <p className="m-0 text-sm lg:text-base text-[var(--color-text)]/70 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Note - decentní */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 border border-gray-100">
            <h3 className="text-base lg:text-lg font-medium text-[var(--color-primary)]/70 mb-3">
              {t('pages.contact.faqNotFound.title')}
            </h3>
            <p className="text-sm lg:text-base text-[var(--color-text)]/60 leading-relaxed mb-4">
              {t('pages.contact.faqNotFound.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <a
                href="tel:+420774488114"
                className="text-sm text-[var(--color-primary)]/60 hover:text-[var(--color-accent)] transition-colors duration-200"
              >
                774 488 114
              </a>
              <a
                href="mailto:info@berryfood.cz"
                className="text-sm text-[var(--color-primary)]/60 hover:text-[var(--color-accent)] transition-colors duration-200"
              >
                info@berryfood.cz
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;