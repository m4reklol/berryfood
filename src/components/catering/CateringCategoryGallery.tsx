import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GalleryInteractive from '../common/GalleryInteractive';

interface CategoryItem {
  id: string;
  title: string;
  blurb?: string;
  images: { src: string; alt: string }[];
}

interface CateringCategoryGalleryProps {
  initialActiveId?: string;
}

const CateringCategoryGallery: React.FC<CateringCategoryGalleryProps> = ({ 
  initialActiveId = 'studeny-raut' 
}) => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(initialActiveId);

  const categories: CategoryItem[] = [
    {
      id: 'studeny-raut',
      title: t('cateringCategories.coldBuffet'),
      images: [
        { src: '/studenyraut1.avif', alt: 'Studený raut 1' },
        { src: '/studenyraut2.avif', alt: 'Studený raut 2' },
        { src: '/studenyraut3.avif', alt: 'Studený raut 3' },
        { src: '/studenyraut4.avif', alt: 'Studený raut 4' },
        { src: '/studenyraut5.avif', alt: 'Studený raut 5' },
        { src: '/studenyraut6.avif', alt: 'Studený raut 6' }
      ]
    },
    {
      id: 'teply-bufet',
      title: t('cateringCategories.warmBuffet'),
      images: [
        { src: '/teplybufet1.avif', alt: 'Teplý bufet 1' },
        { src: '/teplybufet2.avif', alt: 'Teplý bufet 2' },
        { src: '/teplybufet3.avif', alt: 'Teplý bufet 3' },
        { src: '/teplybufet4.avif', alt: 'Teplý bufet 4' },
        { src: '/teplybufet5.avif', alt: 'Teplý bufet 5' },
        { src: '/teplybufet6.avif', alt: 'Teplý bufet 6' }
      ]
    },
    {
      id: 'grilovani',
      title: t('cateringCategories.grilling'),
      images: [
        { src: '/grilovani1.avif', alt: 'Grilování & BBQ 1' },
        { src: '/grilovani2.avif', alt: 'Grilování & BBQ 2' },
        { src: '/grilovani3.avif', alt: 'Grilování & BBQ 3' },
        { src: '/grilovani4.avif', alt: 'Grilování & BBQ 4' },
        { src: '/grilovani5.avif', alt: 'Grilování & BBQ 5' },
        { src: '/grilovani6.avif', alt: 'Grilování & BBQ 6' }
      ]
    },
    {
      id: 'finger-foods',
      title: t('cateringCategories.fingerFoods'),
      images: [
        { src: '/fingerfoods1.avif', alt: 'Finger Foods 1' },
        { src: '/fingerfoods2.avif', alt: 'Finger Foods 2' },
        { src: '/fingerfoods3.avif', alt: 'Finger Foods 3' },
        { src: '/fingerfoods4.avif', alt: 'Finger Foods 4' },
        { src: '/fingerfoods5.avif', alt: 'Finger Foods 5' },
        { src: '/fingerfoods6.avif', alt: 'Finger Foods 6' }
      ]
    },
    {
      id: 'sweet-bar',
      title: t('cateringCategories.sweetBar'),
      images: [
        { src: '/sweetbar1.avif', alt: 'Sweet Bar 1' },
        { src: '/sweetbar2.avif', alt: 'Sweet Bar 2' },
        { src: '/sweetbar3.avif', alt: 'Sweet Bar 3' },
        { src: '/sweetbar4.avif', alt: 'Sweet Bar 4' },
        { src: '/sweetbar5.avif', alt: 'Sweet Bar 5' },
        { src: '/sweetbar6.avif', alt: 'Sweet Bar 6' }
      ]
    },
    {
      id: 'slavnostni-hostina',
      title: t('cateringCategories.festiveHosting'),
      images: [
        { src: '/slavnostnihostina1.avif', alt: 'Slavnostní hostina 1' },
        { src: '/slavnostnihostina2.avif', alt: 'Slavnostní hostina 2' },
        { src: '/slavnostnihostina3.avif', alt: 'Slavnostní hostina 3' },
        { src: '/slavnostnihostina4.avif', alt: 'Slavnostní hostina 4' },
        { src: '/slavnostnihostina5.avif', alt: 'Slavnostní hostina 5' },
        { src: '/slavnostnihostina6.avif', alt: 'Slavnostní hostina 6' }
      ]
    }
  ];

  const activeCategory = categories.find(cat => cat.id === activeId) || categories[0];

  const handleCategoryClick = (categoryId: string) => {
    setActiveId(categoryId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, categoryId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(categoryId);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIndex = categories.findIndex(cat => cat.id === activeId);
      const nextIndex = e.key === 'ArrowLeft' 
        ? (currentIndex - 1 + categories.length) % categories.length
        : (currentIndex + 1) % categories.length;
      handleCategoryClick(categories[nextIndex].id);
    }
  };

  return (
    <div className="space-y-12">
      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            onKeyDown={(e) => handleKeyDown(e, category.id)}
            className={`px-6 py-3 rounded-full font-semibold text-sm tracking-wider uppercase transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 ${
              activeId === category.id
                ? 'bg-[var(--color-accent)] text-white shadow-lg'
                : 'bg-gray-100 text-[var(--color-primary)] hover:bg-gray-200'
            }`}
            aria-selected={activeId === category.id}
            role="tab"
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Active Category Content */}
      <div className="transition-opacity duration-500 ease-in-out">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-4 tracking-wider uppercase">
            {activeCategory.title}
          </h2>
        </div>

        <GalleryInteractive images={activeCategory.images} maxVisible={6} />
      </div>
    </div>
  );
};

export default CateringCategoryGallery;