import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl lg:text-[12rem] xl:text-[14rem] font-black text-[var(--color-accent)] opacity-30 select-none leading-none">
            404
          </h1>
        </div>

        {/* Error Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 lg:w-12 lg:h-12 text-[var(--color-accent)]" />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-primary)] mb-6">
            STRÁNKA NENALEZENA
          </h2>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full"></div>
          </div>
          
          <p className="text-lg lg:text-xl text-[var(--color-text)]/80 leading-relaxed mb-8">
            Omlouváme se, ale stránka, kterou hledáte, neexistuje nebo byla přesunuta.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-[var(--color-accent)] text-white font-semibold text-lg tracking-wider uppercase rounded-full transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 shadow-lg hover:shadow-2xl hover:shadow-[var(--color-accent)]/40 relative overflow-hidden group"
            >
              <Home className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Domů</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#B8954F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-[var(--color-primary)] font-semibold text-lg tracking-wider uppercase rounded-full border-2 border-[var(--color-primary)] transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Zpět</span>
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
            Možná hledáte:
          </h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/catering"
              className="text-[var(--color-accent)] hover:text-[#B8954F] transition-colors duration-200 underline hover:no-underline"
            >
              Catering
            </Link>
            <Link
              to="/menu"
              className="text-[var(--color-accent)] hover:text-[#B8954F] transition-colors duration-200 underline hover:no-underline"
            >
              Menu
            </Link>
            <Link
              to="/rozvoz"
              className="text-[var(--color-accent)] hover:text-[#B8954F] transition-colors duration-200 underline hover:no-underline"
            >
              Rozvoz
            </Link>
            <Link
              to="/kontakt"
              className="text-[var(--color-accent)] hover:text-[#B8954F] transition-colors duration-200 underline hover:no-underline"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;