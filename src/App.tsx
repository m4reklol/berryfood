import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import i18n from './lib/i18n';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Lazy load pages for code splitting
const Home = React.lazy(() => import('./pages/Home'));
const CateringLanding = React.lazy(() => import('./pages/CateringLanding'));
const CateringWeddings = React.lazy(() => import('./pages/CateringWeddings'));
const CateringCorporate = React.lazy(() => import('./pages/CateringCorporate'));
const Menu = React.lazy(() => import('./pages/Menu'));
const Kontakt = React.lazy(() => import('./pages/Kontakt'));
const Rozvoz = React.lazy(() => import('./pages/Rozvoz'));
const AdminMenu = React.lazy(() => import('./pages/AdminMenu'));
const BistroBudex = React.lazy(() => import('./pages/BistroBudex'));
const BistroPlynarna = React.lazy(() => import('./pages/BistroPlynarna'));
const Mista = React.lazy(() => import('./pages/Mista'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Lazy load CookieConsent to ensure it's always available
const CookieConsent = React.lazy(() => import('./components/CookieConsent'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--color-accent)]"></div>
      <p className="text-[var(--color-primary)]/70 text-lg">Loading...</p>
    </div>
  </div>
);

// Component to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <HelmetProvider>
        <Suspense fallback={<PageLoader />}>
          <LanguageProvider>
            <Router>
              <div className="App">
                <ScrollToTop />
                <Header />
                <main>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/catering" element={<CateringLanding />} />
                      <Route path="/catering/svatby" element={<CateringWeddings />} />
                      <Route path="/catering/firemni" element={<CateringCorporate />} />
                      <Route path="/menu" element={<Menu />} />
                      <Route path="/kontakt" element={<Kontakt />} />
                      <Route path="/rozvoz" element={<Rozvoz />} />
                      <Route path="/admin" element={<AdminMenu />} />
                      <Route path="/admin/menu" element={<AdminMenu />} />
                      <Route path="/bistra/budex" element={<BistroBudex />} />
                      <Route path="/bistra/plynarna" element={<BistroPlynarna />} />
                      <Route path="/mista" element={<Mista />} />
                      {/* 404 page for invalid routes */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <Suspense fallback={null}>
                  <CookieConsent />
                </Suspense>
              </div>
            </Router>
          </LanguageProvider>
        </Suspense>
      </HelmetProvider>
    </I18nextProvider>
  );
}

export default App;