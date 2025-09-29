import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show header with smooth delay
    const timer = setTimeout(() => {
      setShowHeader(true);
    }, 150);

    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleScroll = () => {
      // Shorter scroll distance for pages with hero sections
      const scrollThreshold = window.innerHeight * 0.65;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveDropdown(null);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown: string) => {
    // Clear any pending close timeout
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    // Close language dropdown when opening other dropdowns
    setLanguageDropdownOpen(false);
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleKeyDown = (e: React.KeyboardEvent, dropdown: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown(dropdown);
    } else if (e.key === 'Escape') {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        setCloseTimeout(null);
      }
      setActiveDropdown(null);
      setLanguageDropdownOpen(false);
    }
  };

  const handleDropdownMouseLeave = () => {
    // Clear any existing timeout
    if (closeTimeout) {
      clearTimeout(closeTimeout);
    }
    
    // Set a new timeout to close after 300ms
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
      setCloseTimeout(null);
    }, 150);
    
    setCloseTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    // Clear the close timeout if user moves mouse back
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleLanguageDropdownToggle = (isOpen: boolean) => {
    setLanguageDropdownOpen(isOpen);
    // Close other dropdowns when language dropdown opens
    if (isOpen) {
      setActiveDropdown(null);
    }
  };
  const isActivePage = (path: string) => location.pathname === path;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transform transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled 
            ? 'bg-[#F5F1EB] shadow-lg border-b border-[#E8E0D6]' 
            : 'bg-transparent'
        } ${showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/">
                <img 
                  src={isScrolled ? "/berryfoodpngblack.png" : "/berryfoodpngwhite.png"}
                  alt="Berry Food" 
                  className="h-16 lg:h-20 w-auto transition-all duration-500"
                />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-10">
              <Link
                to="/"
                className={`font-medium text-sm tracking-wider uppercase transition-all duration-200 relative py-2 ${
                  isActivePage('/') 
                    ? `${isScrolled ? 'text-[var(--color-primary)]' : 'text-white'} after:w-full` 
                    : `${isScrolled ? 'text-[var(--color-primary)]/80 hover:text-[var(--color-primary)]' : 'text-white/90 hover:text-white'} after:w-0 hover:after:w-full`
                } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[var(--color-accent)] after:transition-all after:duration-300`}
              >
                {t('navigation.home')}
              </Link>

              {/* Catering Dropdown */}
              <div className="relative group">
                <button
                  className={`flex items-center space-x-1 font-medium text-sm tracking-wider uppercase transition-all duration-200 relative py-2 ${
                    location.pathname === '/catering' || location.pathname.startsWith('/catering/') || location.pathname === '/rozvoz'
                      ? `${isScrolled ? 'text-[var(--color-primary)]' : 'text-white'} after:w-full` 
                      : `${isScrolled ? 'text-[var(--color-primary)]/80 hover:text-[var(--color-primary)]' : 'text-white/90 hover:text-white'} after:w-0 hover:after:w-full`
                  } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[var(--color-accent)] after:transition-all after:duration-300`}
                  onClick={() => toggleDropdown('catering')}
                  onKeyDown={(e) => handleKeyDown(e, 'catering')}
                  aria-expanded={activeDropdown === 'catering'}
                  aria-haspopup="true"
                >
                  <span>{t('navigation.catering')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'catering' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'catering' && (
                  <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-56 bg-[#F5F1EB]/95 backdrop-blur-sm rounded-b-2xl shadow-2xl py-3 overflow-hidden z-[9999] dropdown-enter"
                    onMouseLeave={handleDropdownMouseLeave}
                    onMouseEnter={handleDropdownMouseEnter}
                  >
                    <Link 
                      to="/catering/svatby" 
                      className="block px-6 py-4 text-xs font-semibold text-[var(--color-primary)]/90 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-primary)] hover:pl-8 transition-all duration-300 tracking-widest uppercase border-l-4 border-transparent hover:border-[var(--color-accent)] relative group whitespace-nowrap dropdown-item-1"
                    >
                      <span className="relative z-10">{t('navigation.weddings')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    <Link 
                      to="/catering/firemni" 
                      className="block px-6 py-4 text-xs font-semibold text-[var(--color-primary)]/90 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-primary)] hover:pl-8 transition-all duration-300 tracking-widest uppercase border-l-4 border-transparent hover:border-[var(--color-accent)] relative group whitespace-nowrap dropdown-item-2"
                    >
                      <span className="relative z-10">{t('navigation.corporate')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    <Link 
                      to="/rozvoz" 
                      className="block px-6 py-4 text-xs font-semibold text-[var(--color-primary)]/90 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-primary)] hover:pl-8 transition-all duration-300 tracking-widest uppercase border-l-4 border-transparent hover:border-[var(--color-accent)] relative group whitespace-nowrap dropdown-item-3"
                    >
                      <span className="relative z-10">{t('navigation.delivery')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Bistra Dropdown */}
              <div className="relative group">
                <button
                  className={`flex items-center space-x-1 font-medium text-sm tracking-wider uppercase transition-all duration-200 relative py-2 ${
                    location.pathname.startsWith('/bistra') || location.pathname === '/mista'
                      ? `${isScrolled ? 'text-[var(--color-primary)]' : 'text-white'} after:w-full` 
                      : `${isScrolled ? 'text-[var(--color-primary)]/80 hover:text-[var(--color-primary)]' : 'text-white/90 hover:text-white'} after:w-0 hover:after:w-full`
                  } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[var(--color-accent)] after:transition-all after:duration-300`}
                  onClick={() => toggleDropdown('bistra')}
                  onKeyDown={(e) => handleKeyDown(e, 'bistra')}
                  aria-expanded={activeDropdown === 'bistra'}
                  aria-haspopup="true"
                >
                  <span>{t('navigation.bistros')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'bistra' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'bistra' && (
                  <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-56 bg-[#F5F1EB]/95 backdrop-blur-sm rounded-b-2xl shadow-2xl py-3 overflow-hidden z-[9999] dropdown-enter"
                    onMouseLeave={handleDropdownMouseLeave}
                    onMouseEnter={handleDropdownMouseEnter}
                  >
                    <Link 
                      to="/bistra/budex" 
                      className="block px-6 py-4 text-xs font-semibold text-[var(--color-primary)]/90 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-primary)] hover:pl-8 transition-all duration-300 tracking-widest uppercase border-l-4 border-transparent hover:border-[var(--color-accent)] relative group whitespace-nowrap dropdown-item-1"
                    >
                      <span className="relative z-10">{t('navigation.budex')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    <Link 
                      to="/bistra/plynarna" 
                      className="block px-6 py-4 text-xs font-semibold text-[var(--color-primary)]/90 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-primary)] hover:pl-8 transition-all duration-300 tracking-widest uppercase border-l-4 border-transparent hover:border-[var(--color-accent)] relative group whitespace-nowrap dropdown-item-2"
                    >
                      <span className="relative z-10">{t('navigation.plynarna')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    <Link 
                      to="/mista" 
                      className="block px-6 py-4 text-xs font-semibold text-[var(--color-primary)]/90 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-primary)] hover:pl-8 transition-all duration-300 tracking-widest uppercase border-l-4 border-transparent hover:border-[var(--color-accent)] relative group whitespace-nowrap dropdown-item-3"
                    >
                      <span className="relative z-10">{t('navigation.locations')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/menu"
                className={`font-medium text-sm tracking-wider uppercase transition-all duration-200 relative py-2 ${
                  isActivePage('/menu') 
                    ? `${isScrolled ? 'text-[var(--color-primary)]' : 'text-white'} after:w-full` 
                    : `${isScrolled ? 'text-[var(--color-primary)]/80 hover:text-[var(--color-primary)]' : 'text-white/90 hover:text-white'} after:w-0 hover:after:w-full`
                } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[var(--color-accent)] after:transition-all after:duration-300`}
              >
                {t('navigation.menu')}
              </Link>

              {/* Language Switcher */}
              <LanguageSwitcher 
                isScrolled={isScrolled} 
                isMobile={false} 
                onDropdownToggle={handleLanguageDropdownToggle}
                forceClose={activeDropdown !== null}
              />

              {/* CTA Button */}
              <Link
                to="/kontakt"
                className="px-8 py-3 bg-[var(--color-accent)] text-white font-medium text-sm tracking-wider uppercase rounded-full hover:bg-[#B8954F] transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/40 relative overflow-hidden group"
              >
                <span className="relative z-10">{t('navigation.contact')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#B8954F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-full transition-all duration-200 ${
                isScrolled ? 'text-[var(--color-primary)] hover:bg-gray-100' : 'text-white hover:bg-white/10'
              } focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]`}
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Completely Separate */}
      <div className={`lg:hidden fixed inset-0 z-[100] transition-all duration-300 ease-out ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Dark Overlay Background */}
        <div 
          className="absolute inset-0 bg-black/[0.99] backdrop-blur-sm transition-opacity duration-300"
          onClick={closeMenu}
        />
        
        {/* Menu Content */}
        <div className={`relative z-[101] h-full w-full bg-[var(--color-bg)] overflow-y-auto transition-transform duration-300 ease-out ${
          isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full'
        }`}>
          {/* Header with Logo and Close */}
          <div className="flex items-center justify-between p-6">
            <img 
              src="/berryfoodpngblack.png"
              alt="Berry Food" 
              className="h-16 w-auto"
            />
            
            {/* Language Switcher in Mobile Menu */}
            <div onClick={(e) => e.stopPropagation()}>
              <LanguageSwitcher isScrolled={true} isMobile={true} />
            </div>
            
            <button
              onClick={closeMenu}
              className="p-3 rounded-full bg-white/80 text-[var(--color-primary)] shadow-lg hover:bg-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-8 py-8 space-y-6" onClick={closeMenu}>
            {/* Home */}
            <Link
              to="/"
              onClick={closeMenu}
              className="block text-2xl font-semibold text-[var(--color-primary)] py-4 tracking-widest uppercase text-center"
            >
              {t('navigation.home')}
            </Link>

            {/* Catering Section */}
            <div className="text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('catering');
                }}
                className="flex items-center justify-center space-x-2 text-2xl font-semibold text-[var(--color-primary)] py-4 tracking-widest uppercase w-full"
              >
                <span>{t('navigation.catering')}</span>
                <ChevronDown className={`w-6 h-6 transition-transform duration-200 ${activeDropdown === 'catering' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-out ${
                activeDropdown === 'catering' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="text-center space-y-4 pb-4">
                  <Link 
                    to="/catering/svatby" 
                    onClick={closeMenu}
                    className="block text-lg text-[var(--color-primary)]/80 py-3 tracking-wide uppercase hover:text-[var(--color-primary)] transition-colors duration-200"
                  >
                    {t('navigation.weddings')}
                  </Link>
                  <Link 
                    to="/catering/firemni" 
                    onClick={closeMenu}
                    className="block text-lg text-[var(--color-primary)]/80 py-3 tracking-wide uppercase hover:text-[var(--color-primary)] transition-colors duration-200"
                  >
                    {t('navigation.corporate')}
                  </Link>
                  <Link 
                    to="/rozvoz" 
                    onClick={closeMenu}
                    className="block text-lg text-[var(--color-primary)]/80 py-3 tracking-wide uppercase hover:text-[var(--color-primary)] transition-colors duration-200"
                  >
                    {t('navigation.delivery')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Bistra Section */}
            <div className="text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('bistra');
                }}
                className="flex items-center justify-center space-x-2 text-2xl font-semibold text-[var(--color-primary)] py-4 tracking-widest uppercase w-full"
              >
                <span>{t('navigation.bistros')}</span>
                <ChevronDown className={`w-6 h-6 transition-transform duration-200 ${activeDropdown === 'bistra' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-out ${
                activeDropdown === 'bistra' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="text-center space-y-4 pb-4">
                  <Link 
                    to="/bistra/budex" 
                    onClick={closeMenu}
                    className="block text-lg text-[var(--color-primary)]/80 py-3 tracking-wide uppercase hover:text-[var(--color-primary)] transition-colors duration-200"
                  >
                    {t('navigation.budex')}
                  </Link>
                  <Link 
                    to="/bistra/plynarna" 
                    onClick={closeMenu}
                    className="block text-lg text-[var(--color-primary)]/80 py-3 tracking-wide uppercase hover:text-[var(--color-primary)] transition-colors duration-200"
                  >
                    {t('navigation.plynarna')}
                  </Link>
                  <Link 
                    to="/mista" 
                    onClick={closeMenu}
                    className="block text-lg text-[var(--color-primary)]/80 py-3 tracking-wide uppercase hover:text-[var(--color-primary)] transition-colors duration-200"
                  >
                    {t('navigation.locations')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Menu */}
            <Link
              to="/menu"
              onClick={closeMenu}
              className="block text-2xl font-semibold text-[var(--color-primary)] py-4 tracking-widest uppercase text-center"
            >
              {t('navigation.menu')}
            </Link>

            {/* Contact */}
            <Link
              to="/kontakt"
              onClick={closeMenu}
              className="block text-2xl font-semibold text-[var(--color-primary)] py-4 tracking-widest uppercase text-center"
            >
              {t('navigation.contact')}
            </Link>
            
            {/* Fill remaining space to ensure clicks close menu */}
            <div className="flex-1 min-h-32"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;