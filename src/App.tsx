import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';

// Layout Components
import { Header } from './components/layout/Header';
import { ScrollToTopButton } from './components/ui/ScrollToTopButton';

// Section Components
import { SlidesSection } from './components/sections/SlidesSection';
import { HeroSection } from './components/sections/HeroSection';
import { HistorySection } from './components/sections/HistorySection';
import { PriestSection } from './components/sections/PriestSection';
import { PhotoGallery } from './components/sections/PhotoGallery';
import { AlbumGallery } from './components/sections/AlbumGallery';
import { FullGallery } from './components/sections/FullGallery';
import { TimelineSection } from './components/sections/TimelineSection';
import { BlogSection } from './components/sections/BlogSection';
import { AnnouncementsSection } from './components/sections/AnnouncementsSection';
import { ContactSection } from './components/sections/ContactSection';
import { PastoralsPage } from './components/sections/PastoralsPage';
import { CelebrationsPage } from './components/sections/CelebrationsPage';

// Pages
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfUsePage } from './pages/TermsOfUsePage';

// Admin Components
import { AdminPanel } from './components/admin/AdminPanel';
import { LoginForm } from './components/admin/LoginForm';

// UI Components
import { UrgentPopup } from './components/ui/UrgentPopup';
import { Button } from './components/ui/Button';

// Utils
import { supabase } from './lib/supabase';
import { getThemeSettings, applyThemeToDocument } from './lib/theme';

type CurrentView = 
  | 'home' 
  | 'history' 
  | 'priests' 
  | 'photos' 
  | 'albums' 
  | 'full-gallery' 
  | 'timeline' 
  | 'blog' 
  | 'announcements' 
  | 'contact' 
  | 'pastorals' 
  | 'celebrations'
  | 'privacy-policy' 
  | 'terms-of-use';

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('home');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load theme settings
    const loadTheme = async () => {
      try {
        const themeSettings = await getThemeSettings();
        applyThemeToDocument(themeSettings);
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();

    // Check authentication
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigate = (section: string) => {
    setCurrentView(section as CurrentView);
    
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setShowAdmin(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = () => {
    setShowLogin(false);
    setIsAuthenticated(true);
    setShowAdmin(true);
  };

  const handleAdminClose = () => {
    setShowAdmin(false);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <SlidesSection />
            <HeroSection onNavigate={handleNavigate} />
            <HistorySection />
            <PriestSection />
            <PhotoGallery onNavigateToFullGallery={() => setCurrentView('albums')} />
            <TimelineSection />
            <BlogSection />
            <AnnouncementsSection />
            <ContactSection onNavigate={handleNavigate} />
          </>
        );
      case 'history':
        return <HistorySection />;
      case 'priests':
        return <PriestSection />;
      case 'photos':
        return <FullGallery onBack={() => setCurrentView('home')} />;
      case 'albums':
        return <AlbumGallery onBack={() => setCurrentView('home')} />;
      case 'full-gallery':
        return <FullGallery onBack={() => setCurrentView('home')} />;
      case 'timeline':
        return <TimelineSection />;
      case 'blog':
        return <BlogSection onNavigateHome={() => setCurrentView('home')} />;
      case 'announcements':
        return <AnnouncementsSection />;
      case 'contact':
        return <ContactSection onNavigate={handleNavigate} />;
      case 'pastorals':
        return <PastoralsPage onBack={() => setCurrentView('home')} />;
      case 'celebrations':
        return <CelebrationsPage onBack={() => setCurrentView('home')} />;
      case 'privacy-policy':
        return <PrivacyPolicyPage onBack={() => setCurrentView('home')} />;
      case 'terms-of-use':
        return <TermsOfUsePage onBack={() => setCurrentView('home')} />;
      default:
        return (
          <>
            <SlidesSection />
            <HeroSection onNavigate={handleNavigate} />
            <HistorySection />
            <PriestSection />
            <PhotoGallery onNavigateToFullGallery={() => setCurrentView('albums')} />
            <TimelineSection />
            <BlogSection />
            <AnnouncementsSection />
            <ContactSection onNavigate={handleNavigate} />
          </>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* Header - only show on home view */}
      {currentView === 'home' && <Header onNavigate={handleNavigate} />}

      {/* Main Content */}
      <main className="relative">
        {renderCurrentView()}
      </main>

      {/* Admin Button - only show on home view */}
      {currentView === 'home' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed bottom-8 left-4 z-40"
        >
          <Button
            onClick={handleAdminClick}
            variant="outline"
            size="sm"
            className="rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:text-red-800 hover:border-red-300"
            title="Painel Administrativo"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </motion.div>
      )}

      {/* Scroll to Top Button */}
      <ScrollToTopButton />

      {/* Urgent Popup */}
      <UrgentPopup />

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdmin && <AdminPanel onClose={handleAdminClose} />}
      </AnimatePresence>

      {/* Login Form */}
      <AnimatePresence>
        {showLogin && <LoginForm onLogin={handleLogin} />}
      </AnimatePresence>
    </div>
  );
}

export default App;