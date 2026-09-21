import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '../hooks/useSiteContent';

export const HeroSection = ({ isReady = true }: { isReady?: boolean }) => {
  const [activeTab, setActiveTab] = useState('');
  const { content } = useSiteContent('hero');
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  useEffect(() => {
    const sections = ['hero', 'about', 'services', 'projects'];
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'hero') {
            setActiveTab('');
          } else {
            const newTab = entry.target.id.charAt(0).toUpperCase() + entry.target.id.slice(1);
            setActiveTab(newTab);
          }
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px' });

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="hero" className="min-h-[100svh] h-auto md:h-screen bg-[#0a0a0a] flex flex-col overflow-hidden relative font-sans border-b border-white/5" style={{ willChange: 'transform' }}>
      
      {/* Ambient Deep Red Circular Glow */}
      <div className="absolute top-[40%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[700px] md:h-[700px] bg-[#E60000] opacity-10 blur-[120px] md:blur-[180px] rounded-full pointer-events-none z-0"></div>

      {/* Floating Glassmorphism Navbar (Z-50) */}
      <motion.nav
        role="navigation"
        aria-label="Main navigation"
        initial={{ y: -20, opacity: 0 }}
        animate={isReady ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        className="absolute top-4 md:top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 sm:gap-6 md:gap-8 px-4 sm:px-7 py-2.5 md:px-8 md:py-3.5 rounded-full bg-[#111111]/70 backdrop-blur-2xl border border-white/40 border-t-white/90 border-b-black/40 shadow-[0_10px_40px_rgba(0,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(0,0,0,0.9)] text-[10px] sm:text-[11px] md:text-[13px] font-bold tracking-widest uppercase"
      >
        {['Projects', 'Services', 'About', 'Contact'].map((item) => {
          const href = `#${item.toLowerCase()}`;
          const isActive = activeTab === href;
          return (
            <a
              key={item}
              href={href}
              onClick={() => setActiveTab(href)}
              className={`${isActive ? 'text-[#E60000]' : 'text-white hover:text-[#E60000]/70'} hover:scale-105 transition-all duration-300 drop-shadow-md`}
            >
              {item}
            </a>
          );
        })}
      </motion.nav>

      {/* Top Bar (Z-40) */}
      <div className="w-full flex justify-between items-center px-6 md:px-10 pt-16 md:pt-6 pb-6 z-40 text-[10px] sm:text-xs md:text-sm font-semibold tracking-widest uppercase relative">
        <span className="text-[#F8FAFC]">AI & ML ENGINEER</span>
        <a href="#contact" className="text-[#F8FAFC]/70 hover:text-white transition-colors cursor-pointer flex items-center gap-2 group">
          <span className="hidden sm:inline portrait-hide">AVAILABLE FOR HIRE</span>
          <span className="sm:hidden portrait-show-inline">HIRE ME</span>
          <span className="text-[#E60000] text-lg group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>

      {/* Huge Background Text (Z-10) */}
      <div className="absolute top-[12%] md:top-[6%] w-full flex justify-center z-10 pointer-events-none select-none">
        <h1 
          className="text-[#E60000] leading-none whitespace-nowrap opacity-100"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(85px, 26vw, 400px)', textShadow: '0 10px 40px rgba(0,0,0,0.9), 0 0 60px rgba(230,0,0,0.3), 0 0 120px rgba(230,0,0,0.15)' }}
        >
          PORTFOLIO
        </h1>
      </div>

      {/* Responsive Portrait (Z-20) */}
      <motion.div 
        initial={{ y: '100%' }}
        animate={isReady ? { y: 0 } : { y: '100%' }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="flex absolute left-1/2 -translate-x-1/2 bottom-0 z-20 w-full max-w-[500px] md:max-w-[800px] lg:max-w-[900px] px-4 justify-center items-end pointer-events-none"
      >
        <img
          src="/hero-cutout.png"
          alt="Mohamed Ghanem"
          fetchPriority="high"
          className="portrait-tablet-image w-full h-auto object-contain max-h-[60vh] md:max-h-[85vh] lg:max-h-[90vh] pointer-events-auto"
          style={{ 
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,0.7) 16%, black 25%)', 
            maskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,0.7) 16%, black 25%)'
          }}
        />
      </motion.div>

      {/* Main Content Overlay (Z-30) */}
      <div className="portrait-tablet-stack relative z-30 flex-1 w-full h-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 flex flex-col md:flex-row justify-start md:justify-between items-start md:items-end pt-0 sm:pt-24 md:pt-0 pb-0 md:pb-16 pointer-events-none min-h-0 gap-6 md:gap-0">
        
        {/* Left Side Content */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="portrait-tablet-left flex flex-col gap-1 md:gap-1 w-full md:w-5/12 pointer-events-auto text-center md:text-left items-center md:items-start z-40 drop-shadow-xl relative flex-none justify-start pb-8 md:pb-0 min-h-min -mt-4 md:-mt-10"
        >
          <span className="text-white text-xl md:text-[2rem] font-medium tracking-wide mb-1 md:mb-2">HI, I'M</span>
          <h2 
            className="text-white leading-[0.9] uppercase"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(4rem, 20vw, 10.5rem)' }}
          >
            {content?.title ? content.title.split(' ').map((word: string, i: number) => (
              <span key={i}>{word}<br/></span>
            )) : <>MOHAMED<br/>GHANEM</>}
          </h2>
          <span className="text-[#E60000] text-base md:text-lg font-bold tracking-widest uppercase mt-2 md:mt-3 mb-2 md:mb-3 max-w-[95%] sm:max-w-[380px] md:max-w-[350px] lg:max-w-[450px] leading-relaxed">
            {content?.subtitle || 'AI & ML ENGINEER'}
          </span>
          <p className="text-[#A0AAB2] text-xs md:text-sm leading-relaxed max-w-[90%] sm:max-w-[400px] md:max-w-[300px] lg:max-w-[380px]" style={{ fontFamily: "'Inter', sans-serif", textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            {content?.description || 'I engineer intelligent AI models that are not only highly accurate, but scalable, purposeful, and built to perform. From data to deployment, I build solutions with logic and impact.'}
          </p>
        </motion.div>

        {/* Right Side Content */}
        <div 
          className="portrait-tablet-right portrait-static flex flex-col items-center md:items-end w-full md:w-1/3 gap-6 md:gap-12 pointer-events-auto z-40 relative pb-8 md:pb-0 shrink-0 mt-auto md:mt-0"
        >
          {/* Circular Stamp (Hidden on small mobile to save space, visible on sm and up) */}
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="portrait-tablet-mg portrait-hide relative w-24 h-24 md:w-28 md:h-28 hidden sm:flex items-center justify-center"
          >
            {/* SVG rotating text */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                <text className="text-[10px] uppercase tracking-[0.15em] fill-[#A0AAB2]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <textPath href="#circlePath" startOffset="0%">
                    • BUILDING INTELLIGENT AI MODELS • DATA DRIVEN SOLUTIONS 
                  </textPath>
                </text>
              </svg>
            </motion.div>
            {/* Center Text */}
            <span 
              className="text-white text-2xl md:text-3xl leading-none" 
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              MG
            </span>
          </motion.div>

          {/* Spacer to keep the MG stamp elevated but lower than before */}
          <div className="hidden md:block h-[50px] lg:h-[60px] pointer-events-none"></div>


        </div>
      </div>
    </section>
  );
};
