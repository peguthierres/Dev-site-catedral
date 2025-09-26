import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase, Slide } from '../../lib/supabase';

export const SlidesSection: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchSlides();
  }, []);

  // Preload next slide image
  useEffect(() => {
    if (slides.length > 1 && !isMobile) { // Não preload no mobile para economizar
      const nextIndex = (currentSlide + 1) % slides.length;
      const nextSlide = slides[nextIndex];
      if (nextSlide?.image_url && !imageLoaded[nextIndex]) {
        const img = new Image();
        img.onload = () => setImageLoaded(prev => ({ ...prev, [nextIndex]: true }));
        // Usar versão comprimida para preload
        img.src = nextSlide.image_url;
      }
    }
  }, [currentSlide, slides, imageLoaded, isMobile]);

  useEffect(() => {
    if (!isAutoPlay || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const fetchSlides = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('slides')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (data && data.length > 0) {
        setSlides(data);
        // Preload first image
        if (data[0]?.image_url) {
          const img = new Image();
          img.onload = () => setImageLoaded(prev => ({ ...prev, 0: true }));
          img.src = data[0].image_url;
        }
      } else {
        // Default slides with Pexels images
        const defaultSlides: Slide[] = [
          {
            id: '1',
            title: '40 Anos de Fé e Comunhão',
            description: 'Celebrando quatro décadas de bênçãos, milagres e união em Cristo',
            image_url: 'https://imgur.com/gallery/catedral-imagens-z0SxNb1#iNThaz9',
            order_index: 0,
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Nossa Comunidade Unida',
            description: 'Fiéis de todas as idades unidos pela fé no Senhor Santo Cristo dos Milagres',
            image_url: '/slides/img02.jpg',
            order_index: 1,
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Tradição e Modernidade',
            description: 'Preservando nossa rica tradição enquanto abraçamos o futuro com esperança',
            image_url: '/slides/img01.png',
            order_index: 2,
            is_active: true,
            created_at: new Date().toISOString()
          }
        ];
        setSlides(defaultSlides);
        // Preload first default image
        const img = new Image();
        img.onload = () => setImageLoaded(prev => ({ ...prev, 0: true }));
        img.src = defaultSlides[0].image_url;
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    const newIndex = (currentSlide + 1) % slides.length;
    setCurrentSlide(newIndex);
    preloadImage(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    setCurrentSlide(newIndex);
    preloadImage(newIndex);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    preloadImage(index);
  };

  const preloadImage = (index: number) => {
    if (!imageLoaded[index] && slides[index]?.image_url) {
      const img = new Image();
      img.onload = () => setImageLoaded(prev => ({ ...prev, [index]: true }));
      img.src = slides[index].image_url;
    }
  };

  if (isLoading) {
    return (
      <section className="relative w-full min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, var(--color-primary-from), var(--color-primary-to))'
      }}>
        <div className="text-center text-white px-4">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-base sm:text-lg">Carregando slides...</p>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative w-full min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, var(--color-primary-from), var(--color-primary-to))'
      }}>
        <div className="text-center text-white max-w-2xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Catedral de São Miguel Arcanjo
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-4" style={{ color: 'var(--color-accent-2)' }}>
            Tradição e Fé
          </p>
          <p className="text-sm sm:text-base md:text-lg" style={{ color: 'var(--color-accent-1)' }}>
            São Miguel Paulista, São Paulo
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full max-w-full overflow-hidden" style={{ height: '100vh', minHeight: '100vh', width: '100vw', maxWidth: '100vw' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full max-w-full overflow-hidden"
        >
          {/* Background Image Container */}
          <div
            className="absolute inset-0 w-full h-full max-w-full"
            style={{
              backgroundImage: `url(${slides[currentSlide].image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              width: '100%',
              height: '100%',
            }}
          ></div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/30" />
          
          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center px-4 py-8 w-full max-w-full">
            <div className="text-center text-white max-w-4xl mx-auto w-full max-w-full px-2">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight drop-shadow-2xl px-2 w-full max-w-full word-wrap break-words"
              >
                {slides[currentSlide].title}
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 leading-relaxed drop-shadow-lg px-4 max-w-3xl mx-auto w-full max-w-full word-wrap break-words"
              >
                {slides[currentSlide].description}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Mobile Navigation - Bottom indicators */}
          {/* Mobile Navigation - Apenas setas laterais */}
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 md:hidden bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full w-10 h-10 p-0 backdrop-blur-sm"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 md:hidden bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full w-10 h-10 p-0 backdrop-blur-sm"
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Desktop Navigation */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 hidden md:block">
            <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md rounded-full px-6 py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full w-10 h-10 p-0"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                    aria-label={`Ir para slide ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full w-10 h-10 p-0"
                aria-label="Próximo slide"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full w-10 h-10 p-0"
                aria-label={isAutoPlay ? 'Pausar slideshow' : 'Iniciar slideshow'}
              >
                {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Slide Counter */}
      {slides.length > 1 && (
        <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md rounded-lg px-3 py-1">
          <span className="text-white text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      )}
    </section>
  );
};