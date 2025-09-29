import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
}

const ContactForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    topic: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const topicOptions = [
    { value: '', label: t('forms.contact.topics.select') },
    { value: 'general', label: t('forms.contact.topics.general') },
    { value: 'catering', label: t('forms.contact.topics.catering') },
    { value: 'bistro', label: t('forms.contact.topics.bistro') },
    { value: 'delivery', label: t('forms.contact.topics.delivery') },
    { value: 'collaboration', label: t('forms.contact.topics.collaboration') },
    { value: 'feedback', label: t('forms.contact.topics.feedback') },
    { value: 'event', label: t('forms.contact.topics.event') }
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = t('forms.contact.validation.nameRequired');
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = t('forms.contact.validation.emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('forms.contact.validation.emailInvalid');
    }

    // Validate topic
    if (!formData.topic) {
      newErrors.topic = t('forms.contact.validation.topicRequired');
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = t('forms.contact.validation.messageRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      topic: '',
      message: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        resetForm();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100 relative overflow-hidden backdrop-blur-sm">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[var(--color-accent)]/15 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[var(--color-sage)]/10 to-transparent rounded-tr-full"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-sage)] rounded-full flex items-center justify-center shadow-xl">
                <Mail className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-8 leading-tight">
              {t('forms.contact.title')}
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
            </div>
            <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed max-w-2xl mx-auto font-light">
              {t('forms.contact.subtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-base font-semibold text-[var(--color-primary)] mb-3 tracking-wide uppercase">
                {t('forms.contact.fields.name')} {t('forms.contact.required')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all duration-300 text-lg ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder={t('forms.contact.placeholders.name')}
                aria-label={t('forms.contact.fields.name')}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-3 text-base text-red-600 flex items-center space-x-2 font-medium">
                  <AlertCircle className="w-5 h-5" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-[var(--color-primary)] mb-3 tracking-wide uppercase">
                {t('forms.contact.fields.email')} {t('forms.contact.required')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all duration-300 text-lg ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder={t('forms.contact.placeholders.email')}
                aria-label={t('forms.contact.fields.email')}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-3 text-base text-red-600 flex items-center space-x-2 font-medium">
                  <AlertCircle className="w-5 h-5" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-base font-semibold text-[var(--color-primary)] mb-3 tracking-wide uppercase">
                {t('forms.contact.fields.phone')}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-6 py-4 border-2 border-gray-300 bg-white rounded-2xl focus:ring-4 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all duration-300 text-lg"
                placeholder={t('forms.contact.placeholders.phone')}
                aria-label={t('forms.contact.fields.phone')}
                disabled={isSubmitting}
              />
            </div>

            {/* Topic Dropdown */}
            <div>
              <label htmlFor="topic" className="block text-base font-semibold text-[var(--color-primary)] mb-3 tracking-wide uppercase">
                {t('forms.contact.fields.topic')} {t('forms.contact.required')}
              </label>
              <select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all duration-300 text-lg ${
                  errors.topic ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                aria-label={t('forms.contact.fields.topic')}
                disabled={isSubmitting}
              >
                {topicOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.topic && (
                <p className="mt-3 text-base text-red-600 flex items-center space-x-2 font-medium">
                  <AlertCircle className="w-5 h-5" />
                  <span>{errors.topic}</span>
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-base font-semibold text-[var(--color-primary)] mb-3 tracking-wide uppercase">
                {t('forms.contact.fields.message')} {t('forms.contact.required')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all duration-300 text-lg resize-none ${
                  errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                } min-h-[150px]`}
                placeholder={t('forms.contact.placeholders.message')}
                aria-label={t('forms.contact.fields.message')}
                disabled={isSubmitting}
              />
              {errors.message && (
                <p className="mt-3 text-base text-red-600 flex items-center space-x-2 font-medium">
                  <AlertCircle className="w-5 h-5" />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] text-white font-semibold text-base py-3 px-6 rounded-full transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:shadow-[var(--color-accent)]/50 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center space-x-3">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>{t('forms.contact.submitting')}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>{t('forms.contact.submit')}</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#7A8275] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </button>

            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl flex items-center space-x-4 shadow-lg">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="text-green-700 font-semibold text-lg">
                  {t('forms.contact.success')}
                </span>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl flex items-center space-x-4 shadow-lg">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <span className="text-red-700 font-semibold text-lg">
                  {t('forms.contact.error')}
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
