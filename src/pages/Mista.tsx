import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, MapPin, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ContactForm from '../components/ContactForm';

interface GalleryImage {
  src: string;
  alt: string;
}

interface Resort {
  id: string;
  name: string;
  description: string;
  images: GalleryImage[];
  externalLink?: string;
}

const Mista = () => {
  const { t } = useTranslation();

  // Gallery state
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentResortImages, setCurrentResortImages] = useState<GalleryImage[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);
  const [touchDistance, setTouchDistance] = useState(0);
  const [initialTouchDistance, setInitialTouchDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);

  const lightboxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Resort data
  const resorts: Resort[] = [
    {
      id: 'stodola',
      name: 'STODOLA PLÁSTOVICE',
      description: 'Stodola Plástovice je unikátní venkovní lokalita, která harmonicky spojuje rustikální kouzlo s moderními prvky. Tento prostor nabízí ideální zázemí jak pro svatební obřady a hostiny ale i různé společenské akce.\n\nSvatební obřad lze uspořádat v několika malebných zákoutích areálu, včetně prostorného ovocného sadu. Slavnostní hostiny se konají v moderně zrekonstruované stodole, kde tisíce světélek vytvářejí kouzelnou romantickou atmosféru, díky které se budete cítit jako ve snu.\n\nStodola je uzpůsobena na slavnostní tabuli, nebo i raut a disponuje vlastním kompletním vybavením, barem i dostatkem místa pro hudbu a večerní tanec.\n\nSvou útulností Vás překvapí i naše pokoje pro hosty s kapacitou až 32 lůžek. Řekněte nám své ANO.',
      images: [
        { src: '/stodola1.avif', alt: 'Stodola Plástovice - exteriér' },
        { src: '/stodola2.avif', alt: 'Stodola Plástovice - interiér' },
        { src: '/stodola3.avif', alt: 'Stodola Plástovice - svatební hostina' },
        { src: '/stodola4.avif', alt: 'Stodola Plástovice - ovocný sad' },
        { src: '/stodola5.avif', alt: 'Stodola Plástovice - romantická atmosféra' },
        { src: '/stodola6.avif', alt: 'Stodola Plástovice - ubytování' }
      ],
      externalLink: 'https://www.stodolaplastovice.cz/'
    },
    {
      id: 'aloha',
      name: 'ALOHA BAR HLUBOKÁ NAD VLTAVOU',
      description: 'Pozornost snoubenců si právem získávají nové nevšední prostory Aloha baru na Hluboké nad Vltavou.\n\nLetní, až přímořská atmosféra s nedalekou pláží na břehu řeky.\n\nBar nabízí až 300 zastřešených míst k sezení. Od formálního posezení pod beduínským stanem až po ležérní relaxační lehátka položená na jemném bílém písku.\n\nNovomanželé se mohou projet člunem s výhledem na romantický zámek Hluboká, nebo mohou svatebním hostům zpestřit večerní zábavu minigolfem.',
      images: [
        { src: '/aloharbar1.avif', alt: 'Aloha Bar - přímořská atmosféra' },
        { src: '/aloharbar2.avif', alt: 'Aloha Bar - beduínský stan' },
        { src: '/aloharbar3.avif', alt: 'Aloha Bar - relaxační lehátka' },
        { src: '/aloharbar4.avif', alt: 'Aloha Bar - výhled na zámek' },
        { src: '/aloharbar5.avif', alt: 'Aloha Bar - pláž na břehu řeky' },
        { src: '/aloharbar6.avif', alt: 'Aloha Bar - minigolf' }
      ],
      externalLink: 'https://alohabar-hluboka.cz/'
    },
    {
      id: 'strizovicky',
      name: 'STŘÍŽOVICKÝ DVŮR',
      description: 'Tohle krásné stavení se nachází v turisticky atraktivní lokalitě Jindřichohradecka známé také jako Česká Kanada.\n\nDíky nezaměnitelné romantické atmosféře, která z místa vysloveně sálá a přilehlé zrekonstruované stodole, je Střížovický dvůr jako stvořený pro pořádání svateb i různých oslav.',
      images: [
        { src: '/strizovickydvur1.avif', alt: 'Střížovický dvůr - hlavní budova' },
        { src: '/strizovickydvur2.avif', alt: 'Střížovický dvůr - romantická atmosféra' },
        { src: '/strizovickydvur3.avif', alt: 'Střížovický dvůr - stodola' },
        { src: '/strizovickydvur4.avif', alt: 'Střížovický dvůr - svatební prostory' },
        { src: '/strizovickydvur5.avif', alt: 'Střížovický dvůr - Česká Kanada' },
        { src: '/strizovickydvur6.avif', alt: 'Střížovický dvůr - venkovní prostory' }
      ],
      externalLink: 'https://strizovickydvur.cz/'
    },
    {
      id: 'horecky',
      name: 'HORECKÝ DVŮR',
      description: 'Horecký dvůr na Vysočině je dokonalým místem pro váš svatební den.\n\nHistorická atmosféra z roku 1830, stylová stodola pro 90 hostů s barem a gastro kuchyní, a malebná alej, která vás k ní přivede – to vše vytváří jedinečné prostředí plné romantiky.\n\nCelý areál nabízí maximální soukromí, možnost obřadu přímo na místě, luxusní svatební apartmá a terasu ideální pro tanec pod širým nebem. Díky své poloze mimo ruch města si užijete ničím nerušenou oslavu až do pozdních hodin.\n\nZvolte Horecký dvůr a my v Berry Food Catering se postaráme o dokonalé menu, které podtrhne jedinečnost tohoto výjimečného dne.',
      images: [
        { src: '/horeckydvur1.avif', alt: 'Horecký dvůr - historická atmosféra' },
        { src: '/horeckydvur2.avif', alt: 'Horecký dvůr - stylová stodola' },
        { src: '/horeckydvur3.avif', alt: 'Horecký dvůr - malebná alej' },
        { src: '/horeckydvur4.avif', alt: 'Horecký dvůr - svatební apartmá' },
        { src: '/horeckydvur5.avif', alt: 'Horecký dvůr - terasa pro tanec' },
        { src: '/horeckydvur6.avif', alt: 'Horecký dvůr - venkovní prostory' }
      ],
      externalLink: 'https://horeckydvur.cz/'
    },
    {
      id: 'nastrani',
      name: 'RESTAURACE NA STRÁNI',
      description: 'Restaurace Na Stráni na Dobré Vodě u Českých Budějovic nabízí ideální kombinaci moderního stylu a špičkového gastro zážitku.\n\nS kapacitou více než 200 hostů a pohodlným parkováním pro více než 100 aut je perfektním místem nejen pro svatby, ale i pro firemní akce nebo společenské události.\n\nKromě příjemných prostor zajistíme kompletní servis na míru – od vynikajícího rautu přes profesionální obsluhu až po živou hudbu nebo umělecká vystoupení. V Berry Food Catering pro vás připravíme dokonalé menu, které povýší váš slavnostní den na nezapomenutelný zážitek.',
      images: [
        { src: '/nastrani1.avif', alt: 'Restaurace Na Stráni - moderní styl' },
        { src: '/nastrani2.avif', alt: 'Restaurace Na Stráni - gastro zážitek' },
        { src: '/nastrani3.avif', alt: 'Restaurace Na Stráni - svatební prostory' },
        { src: '/nastrani4.avif', alt: 'Restaurace Na Stráni - firemní akce' },
        { src: '/nastrani5.avif', alt: 'Restaurace Na Stráni - profesionální obsluha' },
        { src: '/nastrani6.avif', alt: 'Restaurace Na Stráni - parkování' }
      ],
      externalLink: 'https://www.nastranidobravoda.cz/'
    }
  ];

  // Gallery layout function
  const getGridItemClass = (index: number) => {
    switch (index) {
      case 0: return 'col-span-2 row-span-1 rounded-2xl'; // Wide
      case 1: return 'col-span-1 row-span-2 rounded-2xl'; // Tall
      case 2: return 'col-span-1 row-span-1 rounded-2xl'; // Square
      case 3: return 'col-span-1 row-span-1 rounded-2xl'; // Square
      case 4: return 'col-span-1 row-span-1 rounded-2xl'; // Square
      case 5: return 'col-span-1 row-span-1 rounded-2xl'; // Square
      default: return 'col-span-1 row-span-1 rounded-2xl';
    }
  };

  // Preload adjacent images
  const preloadImage = useCallback((index: number) => {
    if (index >= 0 && index < currentResortImages.length && !loadedImages.has(index)) {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(index));
      };
      img.src = currentResortImages[index].src;
    }
  }, [currentResortImages, loadedImages]);

  // Preload current and adjacent images
  useEffect(() => {
    if (isOpen) {
      preloadImage(currentIndex);
      preloadImage(currentIndex - 1);
      preloadImage(currentIndex + 1);
    }
  }, [isOpen, currentIndex, preloadImage]);

  const openLightbox = (images: GalleryImage[], index: number) => {
    setCurrentResortImages(images);
    setCurrentIndex(index);
    setIsOpen(true);
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    if (currentIndex < currentResortImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetZoom();
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetZoom();
    }
  };

  const resetZoom = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  // Touch distance calculation
  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, 0.5), 4);
    setScale(newScale);
    
    if (newScale === 1) {
      setTranslateX(0);
      setTranslateY(0);
    }
  };

  // Double tap zoom
  const handleDoubleClick = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2);
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 500 && tapLength > 0) {
        handleDoubleClick();
      }
      setLastTap(currentTime);

      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      setInitialTouchDistance(distance);
      setInitialScale(scale);
      setTouchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // Pinch to zoom
      const distance = getTouchDistance(e.touches);
      if (initialTouchDistance > 0) {
        const scaleChange = distance / initialTouchDistance;
        const newScale = Math.min(Math.max(initialScale * scaleChange, 0.5), 4);
        setScale(newScale);
      }
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Pan when zoomed
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;
      setTranslateX(translateX + deltaX);
      setTranslateY(translateY + deltaY);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      setInitialTouchDistance(0);
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setTranslateX(translateX + deltaX);
      setTranslateY(translateY + deltaY);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Swipe detection for mobile
  const [swipeStart, setSwipeStart] = useState({ x: 0, y: 0 });
  const [swipeEnd, setSwipeEnd] = useState({ x: 0, y: 0 });

  const handleSwipeStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && scale === 1) {
      setSwipeStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleSwipeEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 1 && scale === 1) {
      setSwipeEnd({ x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY });
      
      const deltaX = swipeStart.x - e.changedTouches[0].clientX;
      const deltaY = Math.abs(swipeStart.y - e.changedTouches[0].clientY);
      
      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > 50 && deltaY < 100) {
        if (deltaX > 0) {
          nextImage();
        } else {
          prevImage();
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=1920"
            src="/heromista.avif"
            alt="Kde můžeš ochutnat náš catering"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-1"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-accent)]/20 rounded-full blur-3xl z-5"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--color-sage)]/20 rounded-full blur-3xl z-5"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            {/* Hero Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
              {t('mista.hero.title')}<br />
              <span className="text-[var(--color-accent)] drop-shadow-lg">{t('mista.hero.subtitle')}</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
              {t('mista.hero.description').split('\n\n').map((paragraph, index) => (
                <span key={index}>
                  {paragraph}
                  {index < t('mista.hero.description').split('\n\n').length - 1 && <><br /><br /></>}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* Resorts Sections */}
      {resorts.map((resort, resortIndex) => (
        <section 
          key={resort.id} 
          className={`relative py-20 lg:py-32 ${
            resortIndex % 2 === 0 
              ? 'bg-gradient-to-br from-white via-[#FEFCF8] to-white' 
              : 'bg-gradient-to-br from-[#F8F5F0] via-[#FDFBF7] to-[#F5F1EB]'
          } overflow-hidden`}
        >
          {/* Elegant horizontal divider - only for sections after the first */}
          {resortIndex > 0 && (
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center -translate-y-1/2">
              {/* Bigger elegant line divider */}
              <div className="w-full max-w-4xl mx-auto px-4">
                <div className="relative">
                  {/* Main thick gradient line */}
                  <div className="h-[5px] md:h-[6px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent rounded-full opacity-90"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Decorative elements */}
          <div className={`absolute top-32 ${resortIndex % 2 === 0 ? 'left-16' : 'right-16'} w-40 h-40 bg-[var(--color-accent)]/8 rounded-full blur-3xl -z-10`}></div>
          <div className={`absolute bottom-32 ${resortIndex % 2 === 0 ? 'right-16' : 'left-16'} w-48 h-48 bg-[var(--color-sage)]/6 rounded-full blur-3xl -z-10`}></div>
          <div className={`absolute top-1/2 ${resortIndex % 2 === 0 ? 'right-32' : 'left-32'} w-24 h-24 bg-[var(--color-primary)]/4 rounded-full blur-2xl -z-10`}></div>
          
          {/* Enhanced pattern overlay for alternating sections */}
          {resortIndex % 2 !== 0 && (
            <div className="absolute inset-0 opacity-[0.015] -z-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 30%, var(--color-accent) 1px, transparent 1px), radial-gradient(circle at 80% 70%, var(--color-sage) 1px, transparent 1px)`,
                backgroundSize: '60px 60px, 80px 80px'
              }}></div>
            </div>
          )}
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 lg:mb-20">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] mb-8 leading-tight">
                {resort.name}
              </h2>
              <div className="flex justify-center mb-4">
                <div className="w-32 h-1.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-sage)] rounded-full shadow-lg"></div>
              </div>
              {/* Resort number indicator */}
              <div className="flex justify-center">
                <div className="px-4 py-1 bg-[var(--color-accent)]/10 rounded-full">
                  <span className="text-sm font-medium text-[var(--color-accent)] tracking-wider uppercase">
                    {t('mista.common.resortNumber', { number: resortIndex + 1, total: resorts.length })}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="max-w-5xl mx-auto mb-16 lg:mb-20">
              <div className="bg-white rounded-3xl p-10 lg:p-12 shadow-xl border border-gray-100 relative overflow-hidden backdrop-blur-sm">
                {/* Subtle decorative corner */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[var(--color-accent)]/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[var(--color-sage)]/5 to-transparent rounded-tr-full"></div>
                
                <div className="relative z-10 text-center">
                  {resort.id === 'stodola' && (
                    <div className="space-y-8">
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.stodola.text1').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.stodola.text2').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.stodola.text3').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.stodola.text4').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                    </div>
                  )}
                  
                  {resort.id === 'aloha' && (
                    <div className="space-y-8">
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.aloha.text1').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.aloha.text2').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.aloha.text3').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.aloha.text4').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                    </div>
                  )}
                  
                  {resort.id === 'strizovicky' && (
                    <div className="space-y-8">
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.strizovicky.text1').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.strizovicky.text2').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                    </div>
                  )}
                  
                  {resort.id === 'horecky' && (
                    <div className="space-y-8">
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.horecky.text1').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.horecky.text2').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.horecky.text3').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.horecky.text4').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                    </div>
                  )}
                  
                  {resort.id === 'nastrani' && (
                    <div className="space-y-8">
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.nastrani.text1').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.nastrani.text2').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                      <p className="text-xl lg:text-2xl text-[var(--color-text)] leading-relaxed font-light" dangerouslySetInnerHTML={{
                        __html: t('mista.resorts.nastrani.text3').replace(/<highlight>(.*?)<\/highlight>/g, '<span class="text-[var(--color-accent)] font-semibold">$1</span>')
                      }}>
                      </p>
                    </div>
                  )}
                  
                  {/* External link button */}
                  {resort.externalLink && (
                    <div className="mt-8 text-right">
                      <a
                        href={resort.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-[var(--color-primary)] font-medium text-sm tracking-wide rounded-lg border border-[var(--color-accent)]/30 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-all duration-300 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:ring-offset-1 shadow-sm hover:shadow-md relative overflow-hidden group"
                      >
                        <span className="relative z-10">{t('mista.common.visitWebsite')}</span>
                        <ExternalLink className="w-4 h-4 relative z-10 group-hover:text-[var(--color-accent)] transition-colors duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/10 to-[var(--color-sage)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-4 gap-4 lg:gap-6 auto-rows-[200px] md:auto-rows-[220px]">
              {resort.images.map((image, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden bg-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/10 ${getGridItemClass(index)}`}
                  onClick={() => openLightbox(resort.images, index)}
                >
                  {/* Skeleton loader */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-105"
                    onLoad={(e) => {
                      const target = e.target as HTMLElement;
                      const skeleton = target.previousElementSibling as HTMLElement;
                      if (skeleton) skeleton.style.display = 'none';
                    }}
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>

            {/* Section divider */}
            <div className="mt-20 lg:mt-24 flex justify-center">
              {/* Beautiful gradient line */}
              <div className="h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] via-[var(--color-sage)] to-transparent shadow-md rounded-full"></div>
            </div>
          </div>
        </section>
      ))}

      {/* Contact Form Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F8F5F0] via-white to-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>

      {/* Lightbox */}
      {isOpen && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          onClick={(e) => {
            if (e.target === lightboxRef.current) {
              closeLightbox();
            }
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-6 left-6 z-[10000] px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium">
            {currentIndex + 1} / {currentResortImages.length}
          </div>

          {/* Navigation arrows */}
          {currentIndex > 0 && (
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentIndex < currentResortImages.length - 1 && (
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Main image */}
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center overflow-hidden">
            <img
              ref={imageRef}
              src={currentResortImages[currentIndex]?.src}
              alt={currentResortImages[currentIndex]?.alt}
              className="max-w-full max-h-full object-contain transition-transform duration-300 select-none"
              style={{
                transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              onDoubleClick={handleDoubleClick}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={(e) => {
                handleTouchStart(e);
                handleSwipeStart(e);
              }}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => {
                handleTouchEnd(e);
                handleSwipeEnd(e);
              }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Mista;