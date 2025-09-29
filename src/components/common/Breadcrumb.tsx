import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-6 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-[var(--color-primary)]/40 mx-2 flex-shrink-0" />
              )}
              
              {item.current ? (
                <span className="font-semibold text-[var(--color-accent)] tracking-wide uppercase">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href!}
                  className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200 tracking-wide uppercase font-medium underline hover:no-underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;