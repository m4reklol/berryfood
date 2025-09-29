import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Send, CheckCircle, AlertCircle, Calendar, Users } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';

interface CateringLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  headcount: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  date?: string;
  headcount?: string;
}

const CateringLeadModal: React.FC<CateringLeadModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    headcount: '',
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Toast hook
  const { toast, showToast, hideToast } = useToast();

  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Store the element that triggered the modal
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Focus management and body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the first input field after a short delay to ensure modal is rendered
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);

      // ESC key handler
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('forms.cateringLead.validation.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('forms.cateringLead.validation.emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('forms.cateringLead.validation.emailInvalid');
    }

    if (!formData.date) {
      newErrors.date = t('forms.cateringLead.validation.dateRequired');
    }

    if (!formData.headcount.trim()) {
      newErrors.headcount = t('forms.cateringLead.validation.headcountRequired');
    } else if (isNaN(Number(formData.headcount)) || Number(formData.headcount) <= 0) {
      newErrors.headcount = t('forms.cateringLead.validation.headcountInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing (inline validation)
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Real-time email validation
    if (name === 'email' && value && !validateEmail(value)) {
      setErrors(prev => ({
        ...prev,
        email: t('forms.cateringLead.validation.emailInvalid')
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      headcount: '',
      notes: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-catering`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(t('forms.cateringLead.toast.success'), 'success');
        resetForm();
        handleClose();
      } else {
        showToast(t('forms.cateringLead.toast.error'), 'error');
      }
    } catch (error) {
      console.error('Error submitting catering order:', error);
      showToast(t('forms.cateringLead.toast.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
    
    // Return focus to trigger element
    setTimeout(() => {
      triggerElementRef.current?.focus();
    }, 100);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      {/* Global Toast - always rendered */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={2000}
      />
      
      {/* Modal - only when open */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Modal Container */}
          <div 
            ref={modalRef}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-8 py-6">
              <div className="relative flex items-center justify-center min-h-12">
                {/* Icon - positioned absolutely to left */}
                <div className="absolute left-0 top-0 w-12 h-12 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-sage)] rounded-full flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                
                {/* Title - centered */}
                <h2 
                  id="modal-title"
                  className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-primary)] focus:outline-none focus-visible:outline-none text-center leading-tight mx-16 sm:mx-12"
                >
                  <span className="block sm:inline">{t('forms.cateringLead.title')}</span>
                  <span className="block sm:inline sm:ml-2">{t('forms.cateringLead.titleSecond')}</span>
                </h2>

                {/* Close button - positioned absolutely to right */}
                <button
                  className="absolute right-0 top-0 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-[var(--color-primary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"
                  onClick={handleClose}
                  aria-label={t('forms.cateringLead.close')}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Separator */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] via-[var(--color-sage)] to-transparent opacity-30"></div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
              <div className="p-8 lg:p-12">
                {/* Subtitle */}
                <div className="text-center mb-8">
                  <p className="text-lg text-[var(--color-text)]/80 leading-relaxed">
                    {t('forms.cateringLead.subtitle')}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[var(--color-primary)] mb-2 tracking-wide uppercase">
                      {t('forms.cateringLead.fields.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      ref={nameInputRef}
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all duration-300 ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder={t('forms.cateringLead.placeholders.name')}
                      disabled={isSubmitting}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-primary)] mb-2 tracking-wide uppercase">
                      {t('forms.cateringLead.fields.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all duration-300 ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder={t('forms.cateringLead.placeholders.email')}
                      disabled={isSubmitting}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[var(--color-primary)] mb-2 tracking-wide uppercase">
                      {t('forms.cateringLead.fields.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all duration-300"
                      placeholder={t('forms.cateringLead.placeholders.phone')}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Date and Headcount Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date */}
                    <div>
                      <label htmlFor="date" className="block text-sm font-semibold text-[var(--color-primary)] mb-2 tracking-wide uppercase">
                        {t('forms.cateringLead.fields.date')} *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-primary)]/50 pointer-events-none" />
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all duration-300 ${
                            errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                          }`}
                          disabled={isSubmitting}
                          aria-describedby={errors.date ? 'date-error' : undefined}
                        />
                      </div>
                      {errors.date && (
                        <p id="date-error" className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{errors.date}</span>
                        </p>
                      )}
                    </div>

                    {/* Headcount */}
                    <div>
                      <label htmlFor="headcount" className="block text-sm font-semibold text-[var(--color-primary)] mb-2 tracking-wide uppercase">
                        {t('forms.cateringLead.fields.headcount')} *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-primary)]/50 pointer-events-none" />
                        <input
                          type="number"
                          id="headcount"
                          name="headcount"
                          value={formData.headcount}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all duration-300 ${
                            errors.headcount ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                          }`}
                          placeholder={t('forms.cateringLead.placeholders.headcount')}
                          min="1"
                          disabled={isSubmitting}
                          aria-describedby={errors.headcount ? 'headcount-error' : undefined}
                        />
                      </div>
                      {errors.headcount && (
                        <p id="headcount-error" className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{errors.headcount}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-semibold text-[var(--color-primary)] mb-2 tracking-wide uppercase">
                      {t('forms.cateringLead.fields.notes')}
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all duration-300 resize-none"
                      placeholder={t('forms.cateringLead.placeholders.notes')}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] text-white font-semibold text-base py-3 px-6 rounded-full transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:shadow-[var(--color-accent)]/50 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>{t('forms.cateringLead.submitting')}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>{t('forms.cateringLead.submit')}</span>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#7A8275] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  </button>

                </form>
              </div>
            </div>
          </div>

          {/* Custom Scrollbar Styles */}
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .animate-fade-in {
              animation: fadeIn 0.3s ease-out;
            }
            
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 3px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(198, 164, 93, 0.6);
              border-radius: 3px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(198, 164, 93, 0.8);
            }
            
            /* Firefox */
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(198, 164, 93, 0.6) #f1f1f1;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default CateringLeadModal;