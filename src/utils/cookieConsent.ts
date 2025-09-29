// Cookie Consent Utility
// Správa souhlasů s cookies a podmíněné načítání skriptů

export interface CookieConsent {
  version: number;
  status: 'accepted' | 'rejected' | 'custom';
  granted: {
    analytics: boolean;
    marketing: boolean;
  };
  timestamp: number;
}

const STORAGE_KEY = 'berry-food-cookie-consent';
const CURRENT_VERSION = 1;

// Získání aktuálního souhlasu z localStorage
export const getConsent = (): CookieConsent | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const consent = JSON.parse(stored) as CookieConsent;
    
    // Pokud je jiná verze, považuj za neplatný
    if (consent.version !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    return consent;
  } catch {
    return null;
  }
};

// Uložení souhlasu do localStorage
export const setConsent = (consent: Omit<CookieConsent, 'version' | 'timestamp'>) => {
  const fullConsent: CookieConsent = {
    ...consent,
    version: CURRENT_VERSION,
    timestamp: Date.now()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fullConsent));
  
  // Vyvolej event pro ostatní části aplikace
  window.dispatchEvent(new CustomEvent('cookie-consent-updated', { 
    detail: fullConsent 
  }));
  
  return fullConsent;
};

// Kontrola, zda je kategorie povolena
export const hasConsent = (category: 'analytics' | 'marketing'): boolean => {
  const consent = getConsent();
  if (!consent) return false;
  return consent.granted[category];
};

// Spuštění callbacku když je kategorie povolena
export const whenConsented = (
  category: 'analytics' | 'marketing', 
  callback: () => void
) => {
  // Pokud už je souhlas, spusť hned
  if (hasConsent(category)) {
    callback();
    return;
  }
  
  // Jinak naslouchej na změnu souhlasu
  const handleConsentUpdate = (event: CustomEvent<CookieConsent>) => {
    if (event.detail.granted[category]) {
      callback();
      window.removeEventListener('cookie-consent-updated', handleConsentUpdate as EventListener);
    }
  };
  
  window.addEventListener('cookie-consent-updated', handleConsentUpdate as EventListener);
};

// Bezpečné načtení skriptu
export const loadScript = ({ 
  src, 
  id, 
  async = true 
}: { 
  src: string; 
  id: string; 
  async?: boolean; 
}) => {
  // Pokud už script existuje, neloaduj znovu
  if (document.getElementById(id)) {
    return;
  }
  
  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = async;
  document.head.appendChild(script);
};

// Kontrola Do Not Track
export const isDoNotTrackEnabled = (): boolean => {
  return navigator.doNotTrack === '1' || 
         (navigator as any).msDoNotTrack === '1' || 
         (window as any).doNotTrack === '1';
};

// Inicializace Google Analytics (GA4)
export const initializeGA4 = () => {
  // TODO: Nahradit 'G-XXXXXXX' skutečným measurement ID
  const GA_MEASUREMENT_ID = 'G-XXXXXXX'; // Sem vložit reálné GA4 ID
  
  loadScript({ 
    id: 'ga4', 
    src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}` 
  });
  
  // Inicializace gtag
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).gtag = function() { 
    (window as any).dataLayer.push(arguments); 
  };
  
  (window as any).gtag('js', new Date());
  (window as any).gtag('config', GA_MEASUREMENT_ID, { 
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });
};

// Inicializace Meta Pixel (připraveno pro budoucnost)
export const initializeMetaPixel = () => {
  // TODO: Nahradit 'XXXXXXXXX' skutečným Meta Pixel ID
  const META_PIXEL_ID = 'XXXXXXXXX'; // Sem vložit reálné Meta Pixel ID
  
  // Meta Pixel kód - zatím jen komentář pro budoucí implementaci
  /*
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
  */
  
  console.log('Meta Pixel připraven k aktivaci s ID:', META_PIXEL_ID);
};