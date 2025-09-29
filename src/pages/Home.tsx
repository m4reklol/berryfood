import React from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import SEOHead from '../components/SEOHead';

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead pageKey="home" />
      <Hero />
      <AboutSection />
    </>
  );
};

export default Home;