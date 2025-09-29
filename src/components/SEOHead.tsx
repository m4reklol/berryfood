import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  pageKey: string;
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({ pageKey, customTitle, customDescription, customImage }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  
  const title = customTitle || t(`pages.${pageKey}.title`);
  const description = customDescription || t(`pages.${pageKey}.description`);
  const currentLang = i18n.language;
  
  // Helper function to convert relative path to absolute URL
  const toAbsoluteUrl = (path: string): string => {
    const baseUrl = 'https://berryfood.cz';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  };
  
  // Generate canonical URL
  const canonicalUrl = toAbsoluteUrl(location.pathname);
  
  // Social image handling
  const defaultSocialImage = '/berryfoodpngblack.png';
  const socialImage = customImage || defaultSocialImage;
  const fullImageUrl = toAbsoluteUrl(socialImage);
  
  // Available languages for hreflang
  const availableLanguages = ['cs', 'en'];
  
  // Restaurant structured data (JSON-LD)
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Berry Food",
    "url": "https://berryfood.cz",
    "image": toAbsoluteUrl("/berryfoodpngblack.png"),
    "description": "Profesionální catering, rozvoz jídel a útulná bistra v Českých Budějovicích. Čerstvá jídla z kvalitních surovin každý den.",
    "telephone": "+420774488114",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Planá 67",
      "addressLocality": "České Budějovice",
      "postalCode": "37001",
      "addressCountry": "CZ"
    },
    "openingHours": ["Mo-Fr 07:30-15:00"],
    "sameAs": [
      "https://www.instagram.com/berry_food_catering/",
      "https://www.facebook.com/berryfoodcatering"
    ],
    "servesCuisine": "Czech",
    "priceRange": "$$"
  };

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Berry Food" />
      <meta property="og:locale" content={currentLang === 'cs' ? 'cs_CZ' : 'en_US'} />
      {/* Add alternate locales */}
      {availableLanguages
        .filter(lang => lang !== currentLang)
        .map(lang => (
          <meta 
            key={lang}
            property="og:locale:alternate" 
            content={lang === 'cs' ? 'cs_CZ' : 'en_US'} 
          />
        ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@berryfood" />
      
      {/* Hreflang alternates */}
      {availableLanguages.map(lang => (
        <link 
          key={lang}
          rel="alternate" 
          hrefLang={lang} 
          href={toAbsoluteUrl(location.pathname)} 
        />
      ))}
      <link 
        rel="alternate" 
        hrefLang="x-default" 
        href={toAbsoluteUrl(location.pathname)} 
      />
      
      {/* Structured Data - Restaurant Schema */}
      <script type="application/ld+json">
        {JSON.stringify(restaurantSchema)}
      </script>
    </Helmet>
  );
};

export default SEOHead;