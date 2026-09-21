import { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { Preloader } from './components/Preloader';
import { ScrollProgress } from './components/ScrollProgress';
import { CustomCursor } from './components/CustomCursor';
import { HeroSection } from './sections/HeroSection';

const AboutSection = lazy(() => import('./sections/AboutSection').then(m => ({ default: m.AboutSection })));
const ServicesSection = lazy(() => import('./sections/ServicesSection').then(m => ({ default: m.ServicesSection })));
const ProjectsSection = lazy(() => import('./sections/ProjectsSection').then(m => ({ default: m.ProjectsSection })));
const FooterSection = lazy(() => import('./sections/FooterSection').then(m => ({ default: m.FooterSection })));
import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from './pages/AdminDashboard';
import { AIChatWidget } from './components/AIChatWidget';

function Portfolio() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const handlePreloaderComplete = useCallback(() => setIsPreloaderDone(true), []);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scrolling after preloader is done
  useEffect(() => {
    if (!isPreloaderDone) return;

    const lenis = new Lenis({
      lerp: 0.25,
      wheelMultiplier: 0.5,
      touchMultiplier: 0.8,
      smoothWheel: true,
      infinite: false,
    });

    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    // Make Lenis work with anchor links (smooth scroll to sections)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (anchor) {
        const id = anchor.getAttribute('href');
        if (id && id !== '#') {
          e.preventDefault();
          const el = document.querySelector(id);
          if (el) {
            lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.8 });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, [isPreloaderDone]);

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      {!isPreloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
      
      <main 
        className="main-wrapper w-full bg-[#0C0C0C] font-sans antialiased selection:bg-[#E60000] selection:text-white"
        style={{ 
          opacity: isPreloaderDone ? 1 : 0,
          pointerEvents: isPreloaderDone ? 'auto' : 'none',
          height: isPreloaderDone ? 'auto' : '100vh',
          overflow: isPreloaderDone ? 'visible' : 'hidden'
        }}
      >
        <HeroSection isReady={isPreloaderDone} />
        <Suspense fallback={<div className="w-full h-20 bg-[#0C0C0C]"></div>}>
          <AboutSection />
          <ServicesSection />
          <ProjectsSection />
          <FooterSection />
        </Suspense>
      </main>

      <AIChatWidget />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/mg" element={<AdminDashboard />} />
      <Route path="/mg/login" element={<AdminDashboard />} />
      <Route path="/studio" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
