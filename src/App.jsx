import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight,
  Menu,
  X,
  Instagram,
  Linkedin,
  Facebook,
  Play,
  ArrowUpRight,
  Youtube
} from 'lucide-react';

/**
 * CUSTOM HOOK: WHISPER SCROLL REVEAL
 */
const useScrollReveal = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

/**
 * ULTRA-MINIMAL THEMEABLE CURSOR
 */
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      // Hide the custom cursor when hovering over the interactive map
      setIsHidden(!!e.target.closest('#global-map'));
    };
    
    const handleMouseOver = (e) => {
      const isInteractive = e.target.closest('button') || e.target.closest('a') || e.target.closest('.interactive') || e.target.closest('input') || e.target.closest('textarea');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[10000] hidden md:block transition-opacity duration-300 cursor-dot"
        style={{ 
          transform: `translate(${position.x - 3}px, ${position.y - 3}px)`,
          opacity: isHidden ? 0 : (isHovering ? 0 : 1)
        }}
      />
      <div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] transition-all duration-500 ease-out hidden md:block border cursor-ring ${
          isHovering ? 'w-16 h-16' : 'w-8 h-8 opacity-0'
        }`}
        style={{ 
          transform: `translate(${position.x - (isHovering ? 32 : 16)}px, ${position.y - (isHovering ? 32 : 16)}px)`,
          opacity: isHidden ? 0 : undefined
        }}
      />
    </>
  );
};

/* ==========================================================================
   SHARED GLOBAL COMPONENTS
   ========================================================================== */

const Preloader = ({ finishLoading }) => {
  const [quote, setQuote] = useState("");
  const [isFading, setIsFading] = useState(false);
  const [startProgress, setStartProgress] = useState(false);

  const quotes = [
    "Engineering atmospheres, architecting experiences.",
    "The magic resides in the unseen logistics.",
    "We do not remember days, we remember moments.",
    "Perfection is achieved when there is nothing left to take away.",
    "Luxury is the meticulous execution of every detail."
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const progressTimer = setTimeout(() => setStartProgress(true), 100);
    const fadeTimer = setTimeout(() => setIsFading(true), 2500);
    const removeTimer = setTimeout(() => finishLoading(), 3500);
    
    return () => { 
      clearTimeout(progressTimer);
      clearTimeout(fadeTimer); 
      clearTimeout(removeTimer); 
    };
  }, [finishLoading]);

  return (
    <div className={`fixed inset-0 z-[9000] bg-[#050505] flex flex-col items-center justify-center px-12 transition-opacity duration-1000 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="overflow-hidden mb-8">
        <h2 className="text-white/80 font-wide font-extralight tracking-[0.2em] uppercase text-xs md:text-sm text-center max-w-2xl leading-relaxed animate-fade-in-up">
          {quote}
        </h2>
      </div>
      <div className="w-48 md:w-64 h-[1px] bg-white/10 relative overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="absolute top-0 left-0 h-full bg-white transition-all ease-linear" style={{ width: startProgress ? '100%' : '0%', transitionDuration: '2400ms' }} />
      </div>
    </div>
  );
};

const Footer = ({ setCurrentPage }) => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <footer className="bg-[#050505] pt-32 2xl:pt-48 pb-12 px-6 md:px-12 2xl:px-24 border-t border-white/5">
      <div ref={ref} className={`max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32 2xl:mb-48">
          <div>
            <img 
              src="https://infinityincevents.com/wp-content/uploads/Logo-Transparent-2048x569.png" 
              alt="Infinity Inc Logo" 
              className="h-[50px] md:h-[70px] 2xl:h-[90px] object-contain invert brightness-0 mb-12 opacity-90 cursor-pointer interactive" 
              onClick={() => setCurrentPage('home')}
            />
            <p className="text-[9px] 2xl:text-[10px] font-sans tracking-[0.5em] uppercase text-white/40 mb-8 border-b border-white/10 inline-block pb-3">Initialize Sequence</p>
            <h2 className="text-5xl md:text-6xl 2xl:text-8xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-10 leading-none">
              Let's craft <br/> the <span className="text-transparent custom-stroke-text font-normal">exceptional.</span>
            </h2>
            <a href="mailto:info@infinityincevents.com" className="interactive flex items-center w-fit text-xs 2xl:text-sm font-sans tracking-[0.2em] uppercase text-white hover:text-white/50 transition-colors border-b border-white/20 hover:border-white/5 pb-2 group">
              INFO@INFINITYINCEVENTS.COM
              <ArrowUpRight className="w-4 h-4 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={1.5} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-12 md:justify-end">
            <div className="flex flex-col space-y-5 text-[9px] 2xl:text-[11px] font-sans tracking-[0.3em] uppercase text-white/50">
              <span className="text-white font-semibold mb-2 border-b border-white/10 pb-3 w-fit">Network</span>
              <span>Pune (HQ)</span>
              <span>Mumbai</span>
              <span>Delhi-NCR</span>
              <span>Bangalore</span>
              <span>Goa</span>
            </div>
            <div className="flex flex-col space-y-5 text-[9px] 2xl:text-[11px] font-sans tracking-[0.3em] uppercase text-white/50">
              <span className="text-white font-semibold mb-2 border-b border-white/10 pb-3 w-fit">Navigation</span>
              <button onClick={() => setCurrentPage('home')} className="interactive text-left hover:text-white transition-colors w-fit">Home</button>
              <button onClick={() => setCurrentPage('about')} className="interactive text-left hover:text-white transition-colors w-fit">About</button>
              <button onClick={() => setCurrentPage('expertise')} className="interactive text-left hover:text-white transition-colors w-fit">Expertise</button>
              <button onClick={() => setCurrentPage('gallery')} className="interactive text-left hover:text-white transition-colors w-fit">Gallery</button>
              <button onClick={() => setCurrentPage('contact')} className="interactive text-left hover:text-white transition-colors w-fit">Contact</button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center text-[8px] 2xl:text-[10px] font-sans text-white/40 tracking-[0.4em] uppercase gap-4">
          <span>© {new Date().getFullYear()} Infinity Inc.</span>
          <span>All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
};

const GlobalMap = () => {
  const mapRef = useRef(null);
  const [activeLocation, setActiveLocation] = useState(null);

  useEffect(() => {
    const initMap = () => {
      if (!window.L || mapRef.current) return;
      
      const map = window.L.map('global-map', {
        center: [25, 10], // Adjusted center to show more of the global spread
        zoom: 2.5, // Zoomed out slightly to fit the new global nodes
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: true
      });
      mapRef.current = map;

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      const customIcon = window.L.divIcon({
        className: 'custom-pin',
        html: '<div style="background-color: white; width: 6px; height: 6px; border-radius: 50%; box-shadow: 0 0 15px 3px rgba(255,255,255,0.7); cursor: pointer;"></div>',
        iconSize: [6, 6],
        iconAnchor: [3, 3]
      });

      const locations = [
        // Original Nodes
        { name: "Pune (HQ)", coords: [18.5204, 73.8567], subtitle: "Fintech Leadership Summit", year: "2023", attendees: "1,200 Delegates", setup: "Kinetic LED ceiling with 360° surround staging", description: "A hyper-secure, data-driven environment engineered for top-tier global banking executives." },
        { name: "Mumbai", coords: [19.0760, 72.8777], subtitle: "The Heritage Union", year: "2024", attendees: "3,500+ VIPs", setup: "Bespoke glasshouse with hanging floral chandeliers", description: "Orchestrated massive stadium-scale infrastructure for India's most high-profile celebrity union." },
        { name: "Delhi-NCR", coords: [28.7041, 77.1025], subtitle: "Global Auto Expo Reveal", year: "2025", attendees: "8,000+ Visitors", setup: "Holographic car reveals & tiered amphitheater", description: "Executed an immersive, high-decibel launch environment for a flagship electric vehicle reveal." },
        { name: "Bangalore", coords: [12.9716, 77.5946], subtitle: "DevCon Global", year: "2023", attendees: "12,000 Tech Leaders", setup: "Multi-zone festival layout with RFID tracking", description: "Designed a massive tech playground featuring zero-latency streaming nodes across multiple stages." },
        { name: "Goa", coords: [15.2993, 74.1240], subtitle: "Private Island Buyout", year: "2022", attendees: "300 Exclusive Guests", setup: "Floating altars & custom-built beach cabanas", description: "Curated an ultra-luxury, multi-day destination wedding retreat with completely invisible logistics." },
        { name: "Dubai", coords: [25.2048, 55.2708], subtitle: "Web3 World Summit", year: "2024", attendees: "15,000+ Attendees", setup: "Immersive metaverse tunnels & 50ft LED monoliths", description: "Produced a groundbreaking crypto exhibition merging digital art with massive physical architecture." },
        { name: "London", coords: [51.5074, -0.1278], subtitle: "Luxury Fashion Afterparty", year: "2023", attendees: "800 A-List Celebrities", setup: "Neon lightscapes inside a historic gothic cathedral", description: "Hosted an exclusive VIP gala with high-end talent procurement and strict non-disclosure operations." },
        { name: "Monaco", coords: [43.7384, 7.4246], subtitle: "The Monaco Estate Vows", year: "2025", attendees: "150 Ultra-HNW Individuals", setup: "Cliffside cantilevered dining deck & orchestrals", description: "Engineered absolute perfection for an intimate, highly secure private wedding over the Mediterranean." },
        { name: "Singapore", coords: [1.3521, 103.8198], subtitle: "APAC Innovation Retreat", year: "2024", attendees: "500 C-Suite Leaders", setup: "Bio-responsive lighting & sustainable bamboo structures", description: "Architected a seamless cross-border corporate summit focused on future sustainable technologies." },
        { name: "Bali", coords: [-8.4095, 115.1889], subtitle: "The Oceanfront Vows", year: "2023", attendees: "250 Guests", setup: "Transparent marquee built directly over the surf", description: "Delivered a breathtaking, emotionally resonant celebration precariously engineered on coastal cliffs." },
        { name: "Abu Dhabi", coords: [24.4539, 54.3773], subtitle: "Desert Arena Concert", year: "2024", attendees: "45,000 Fans", setup: "Massive truss systems with synchronized drone swarms", description: "Created cinematic audiovisual landscapes and stadium-grade infrastructure for an international pop tour." },
        { name: "Paris", coords: [48.8566, 2.3522], subtitle: "Haute Couture Launch", year: "2025", attendees: "600 Industry Insiders", setup: "Mirrored runways & kinetic floral installations", description: "Bespoke spatial architecture designed to radically amplify a heritage luxury brand's new creative vision." },
        
        // Expanded Global Nodes
        { name: "New York", coords: [40.7128, -74.0060], subtitle: "Wall Street Gala", year: "2024", attendees: "1,500 Elites", setup: "Suspended LED arrays inside a historic bank vault", description: "Orchestrated a hyper-exclusive financial summit merging historic architecture with cyberpunk lighting design." },
        { name: "Los Angeles", coords: [34.0522, -118.2437], subtitle: "Hollywood Premiere '25", year: "2025", attendees: "2,000 VIPs", setup: "Projection-mapped Hollywood Hills estate", description: "Executed flawless invisible logistics for an A-list movie premiere, featuring 3D holographic red carpets." },
        { name: "Sydney", coords: [-33.8688, 151.2093], subtitle: "APAC Finance Summit", year: "2023", attendees: "4,500 Delegates", setup: "Harborside transparent marquees & acoustic baffling", description: "Designed a massive corporate engagement overlooking the Opera House, featuring seamless multi-stage broadcasts." },
        { name: "Cape Town", coords: [-33.9249, 18.4241], subtitle: "The Vineyard Union", year: "2024", attendees: "250 Guests", setup: "Floating glass platforms amidst historic vineyards", description: "Curated a breathtaking destination wedding leveraging the natural topography for a deeply cinematic aesthetic." },
        { name: "Milan", coords: [45.4642, 9.1900], subtitle: "Fashion Week Showcase", year: "2025", attendees: "800 Industry Insiders", setup: "Kinetic runway with mirrored ceiling installations", description: "Architected a razor-sharp, high-contrast environment designed specifically to amplify a luxury fashion collection." },
        { name: "Ibiza", coords: [38.9067, 1.4206], subtitle: "Sunset Soundscapes", year: "2022", attendees: "12,000 Fans", setup: "Cliffside multi-tiered staging with laser matrices", description: "Engineered a euphoric electronic music festival with zero-latency visual syncing and heavy acoustic engineering." },
        { name: "Maldives", coords: [3.2028, 73.2207], subtitle: "Atoll Buyout & Vows", year: "2024", attendees: "100 Ultra-HNW Individuals", setup: "Submerged dining pods and bioluminescent lighting", description: "Delivered absolute discretion and microscopic precision for a week-long royal union on a private atoll." },
        { name: "Riyadh", coords: [24.7136, 46.6753], subtitle: "Future Tech Expo", year: "2025", attendees: "25,000+ Visitors", setup: "50-foot LED monoliths and VR demonstration zones", description: "Produced a monumental tech exhibition pushing the absolute limits of spatial computing and physical architecture." },
        { name: "Istanbul", coords: [41.0082, 28.9784], subtitle: "Bosphorus Royal Gala", year: "2023", attendees: "600 VIPs", setup: "Palace takeover with custom-built docking pavilions", description: "Bridged two continents with a seamlessly orchestrated luxury event at a historic waterfront palace." },
        { name: "Kyoto", coords: [35.0116, 135.7681], subtitle: "Zenith Executive Retreat", year: "2022", attendees: "50 C-Suite Leaders", setup: "Minimalist bamboo pavilions and ambient soundscapes", description: "Crafted a hyper-focused, sensory-deprived environment for top-tier executives to strategize in absolute silence." }
      ];

      locations.forEach(loc => {
        const marker = window.L.marker(loc.coords, { icon: customIcon })
          .addTo(map)
          .bindTooltip(loc.name, { direction: 'top', className: 'custom-tooltip', offset: [0, -10] });
          
        marker.on('click', () => {
          setActiveLocation(loc);
        });
      });
      
      // Close box if clicking elsewhere on the map
      map.on('click', () => {
        setActiveLocation(null);
      });
    };

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-[50vh] md:h-[60vh] 2xl:h-[70vh] rounded-2xl overflow-hidden border border-white/5 relative z-10 group mb-20 bg-[#050505] interactive">
      <div id="global-map" className="w-full h-full z-0 opacity-70 group-hover:opacity-100 transition-opacity duration-1000 cursor-grab active:cursor-grabbing"></div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(5,5,5,1)] z-10"></div>
      
      {/* Interactive Location Brief Box */}
      <div className={`absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 w-[calc(100%-3rem)] md:w-[28rem] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] shadow-2xl ${activeLocation ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        {activeLocation && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveLocation(null); }}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors interactive"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
            <div className="pr-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/40">{activeLocation.name}</p>
                <span className="font-mono text-[9px] tracking-[0.2em] text-white/30 border border-white/10 px-2 py-1 rounded-sm">{activeLocation.year}</span>
              </div>
              <h4 className="text-xl md:text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-6 leading-tight">{activeLocation.subtitle}</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-6 border-y border-white/10 py-5">
                <div>
                  <p className="font-sans text-[8px] tracking-[0.3em] uppercase text-white/30 mb-2">Scale</p>
                  <p className="font-sans text-[10px] tracking-[0.1em] text-white/80">{activeLocation.attendees}</p>
                </div>
                <div>
                  <p className="font-sans text-[8px] tracking-[0.3em] uppercase text-white/30 mb-2">Setup</p>
                  <p className="font-sans text-[10px] tracking-[0.1em] text-white/80 leading-relaxed pr-2">{activeLocation.setup}</p>
                </div>
              </div>
              
              <p className="font-sans text-[10px] 2xl:text-xs tracking-[0.15em] uppercase text-white/60 leading-relaxed">
                {activeLocation.description}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const GlobalNodes = () => {
  const [ref, isVisible] = useScrollReveal();
  const nodes = [
    { city: "Pune", type: "HQ & Design Lab", email: "pune@infinityincevents.com" },
    { city: "Mumbai", type: "Showbiz Division", email: "mumbai@infinityincevents.com" },
    { city: "Delhi-NCR", type: "Corporate Division", email: "delhi@infinityincevents.com" },
    { city: "Goa", type: "Destination Logistics", email: "goa@infinityincevents.com" }
  ];

  return (
    <section className="py-24 2xl:py-32 px-6 md:px-12 2xl:px-24 bg-[#0a0a0a] border-b border-white/5">
      <div ref={ref} className={`max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="text-center mb-20">
          <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-6">Global Portfolio</p>
          <h2 className="text-3xl md:text-5xl 2xl:text-6xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
            Our Top <span className="text-transparent custom-stroke-text font-normal">Events.</span>
          </h2>
        </div>
        <GlobalMap />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 2xl:gap-12">
          {nodes.map((node, i) => (
            <div key={i} className="p-10 border border-white/10 rounded-2xl hover:border-white/30 transition-colors duration-500 interactive group bg-[#050505]">
              <h3 className="text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-2">{node.city}</h3>
              <p className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40 mb-8">{node.type}</p>
              <p className="font-sans text-[10px] 2xl:text-xs tracking-[0.1em] text-white/70 group-hover:text-white transition-colors">{node.email}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Vision = () => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="py-40 md:py-56 2xl:py-72 bg-[#050505] px-6 border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none"></div>
      <div ref={ref} className={`max-w-4xl 2xl:max-w-6xl mx-auto text-center transition-all duration-1000 ease-out relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-12">The Philosophy</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl font-wide font-extralight uppercase tracking-[0.08em] leading-[1.3] text-white/80">
          "There is nothing like a dream to create the future. We dreamt of art. We dreamt of entertainment. We dreamt <span className="text-white font-normal italic">Infinity</span>."
        </h2>
      </div>
    </section>
  );
};

const Metrics = () => {
  const [ref, isVisible] = useScrollReveal();
  const stats = [
    { num: "24+", label: "Years of Excellence" },
    { num: "5", label: "Global Nodes" },
    { num: "2K+", label: "Events Orchestrated" },
    { num: "100%", label: "Bespoke Delivery" }
  ];

  return (
    <section className="bg-[#050505] border-y border-white/5 px-6 md:px-12 2xl:px-24 py-32 2xl:py-48">
      <div ref={ref} className={`max-w-[2160px] mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#0a0a0a] py-16 px-8 flex flex-col items-center justify-center text-center group interactive hover:bg-[#0d0d0d] transition-colors duration-500">
              <span className="text-4xl md:text-6xl 2xl:text-7xl font-wide font-extralight text-white mb-4 tracking-[0.05em] group-hover:scale-110 transition-transform duration-700">{stat.num}</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/50">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   HOME PAGE COMPONENTS
   ========================================================================== */

const Hero = ({ setCurrentPage }) => {
  const [idx1, setIdx1] = useState(0);
  const [idx2, setIdx2] = useState(0);
  const [idx3, setIdx3] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const base1 = ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1600"];
  const base2 = ["https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1600"];
  const base3 = ["https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1540039155733-d7696c45133a?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1470229722913-7c090be5c560?auto=format&fit=crop&q=80&w=1600"];

  const col1Images = [...base1, ...base1, ...base1, ...base1];
  const col2Images = [...base2, ...base2, ...base2, ...base2];
  const col3Images = [...base3, ...base3, ...base3, ...base3];

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const i1 = setInterval(() => setIdx1(prev => (prev < col1Images.length - 1 ? prev + 1 : prev)), 5000);
    const i2 = setInterval(() => setIdx2(prev => (prev < col2Images.length - 1 ? prev + 1 : prev)), 7000);
    const i3 = setInterval(() => setIdx3(prev => (prev < col3Images.length - 1 ? prev + 1 : prev)), 9000);

    setTimeout(() => setIdx1(1), 1500);
    setTimeout(() => setIdx2(1), 3500);
    setTimeout(() => setIdx3(1), 5500);

    return () => { clearInterval(i1); clearInterval(i2); clearInterval(i3); };
  }, [col1Images.length, col2Images.length, col3Images.length]);

  return (
    <section className="relative h-screen w-full bg-[#050505] overflow-hidden">
      <div className={`hidden md:flex absolute inset-0 w-full h-full z-0 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-1/3 h-full overflow-hidden border-r border-white/5">
          <div className="absolute top-0 left-0 w-full flex flex-col transition-transform duration-[2500ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translateY(-${idx1 * 100}vh)` }}>
            {col1Images.map((img, i) => (
              <div key={`c1-${i}`} className="relative w-full h-screen flex-shrink-0 overflow-hidden">
                <img src={img} className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" alt="Corporate" />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-1/3 h-full overflow-hidden border-r border-white/5">
          <div className="absolute bottom-0 left-0 w-full flex flex-col-reverse transition-transform duration-[2500ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translateY(${idx2 * 100}vh)` }}>
            {col2Images.map((img, i) => (
              <div key={`c2-${i}`} className="relative w-full h-screen flex-shrink-0 overflow-hidden">
                <img src={img} className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" style={{ animationDelay: '-3s' }} alt="Wedding" />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-1/3 h-full overflow-hidden">
          <div className="absolute top-0 left-0 w-full flex flex-col transition-transform duration-[2500ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translateY(-${idx3 * 100}vh)` }}>
            {col3Images.map((img, i) => (
              <div key={`c3-${i}`} className="relative w-full h-screen flex-shrink-0 overflow-hidden">
                <img src={img} className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" style={{ animationDelay: '-6s' }} alt="Concert" />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`flex md:hidden absolute inset-0 w-full h-full flex-col z-0 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-full h-1/3 overflow-hidden border-b border-white/5">
          <div className="absolute top-0 left-0 h-full flex transition-transform duration-[2500ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translateX(-${idx1 * 100}vw)` }}>
            {col1Images.map((img, i) => (
              <div key={`m-c1-${i}`} className="relative w-screen h-full flex-shrink-0 overflow-hidden">
                <img src={img} className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" alt="Corporate" />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-full h-1/3 overflow-hidden border-b border-white/5">
          <div className="absolute top-0 right-0 h-full flex flex-row-reverse transition-transform duration-[2500ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translateX(${idx2 * 100}vw)` }}>
            {col2Images.map((img, i) => (
              <div key={`m-c2-${i}`} className="relative w-screen h-full flex-shrink-0 overflow-hidden">
                <img src={img} className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" style={{ animationDelay: '-3s' }} alt="Wedding" />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-full h-1/3 overflow-hidden">
          <div className="absolute top-0 left-0 h-full flex transition-transform duration-[2500ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translateX(-${idx3 * 100}vw)` }}>
            {col3Images.map((img, i) => (
              <div key={`m-c3-${i}`} className="relative w-screen h-full flex-shrink-0 overflow-hidden">
                <img src={img} className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" style={{ animationDelay: '-6s' }} alt="Concert" />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[35vh] bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none z-10"></div>

      <div className="absolute bottom-0 left-0 w-full z-20 px-6 md:px-12 2xl:px-24 h-auto md:h-[20vh] flex flex-col lg:flex-row lg:items-end justify-between pb-8 md:pb-12 pointer-events-none gap-6 2xl:gap-12 max-w-[2160px] mx-auto">
        <div className="flex flex-col justify-end lg:w-[70%] shrink-0">
          <p className={`font-sans text-[8px] md:text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/50 mb-3 md:mb-4 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Est. 2000 // Pune, India
          </p>
          <h1 className={`font-wide text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl font-extralight tracking-[0.08em] text-white uppercase leading-none drop-shadow-2xl transition-all duration-1000 delay-500 whitespace-normal xl:whitespace-nowrap ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Infinite Experiences
          </h1>
        </div>

        <div className={`flex flex-col lg:w-[25%] gap-5 lg:gap-6 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="font-sans text-[9px] md:text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/70 leading-relaxed">
            India's premier event architects. Specializing strictly in <span className="text-white font-medium">Corporate Summits</span> and <span className="text-white font-medium">Bespoke Weddings</span>.
          </p>
          <button onClick={() => setCurrentPage('contact')} className="pointer-events-auto interactive px-8 py-3.5 2xl:px-12 2xl:py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[9px] 2xl:text-[11px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500 shadow-xl w-fit">
            Initialize
          </button>
        </div>
      </div>
    </section>
  );
};

const Showreel = () => {
  const [ref, isVisible] = useScrollReveal(0.2);

  return (
    <section className="bg-[#050505] pt-32 2xl:pt-48 pb-32 2xl:pb-48 flex flex-col items-center w-full relative z-20 overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full overflow-hidden flex z-0 opacity-20 pointer-events-none select-none">
        <div className="flex animate-marquee w-max text-[20vw] 2xl:text-[15vw] font-wide font-extralight tracking-[0.05em] uppercase text-transparent custom-stroke-text leading-none" style={{ animationDuration: '150s' }}>
          <div className="flex whitespace-nowrap"><span className="pr-12">SHOWREEL • SHOWREEL • SHOWREEL • </span></div>
          <div className="flex whitespace-nowrap"><span className="pr-12">SHOWREEL • SHOWREEL • SHOWREEL • </span></div>
        </div>
      </div>

      <div 
        ref={ref}
        className={`w-full max-w-5xl 2xl:max-w-7xl aspect-[16/9] px-6 md:px-0 mx-auto transition-all duration-1000 delay-300 relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
      >
        <div className="w-full h-full rounded-[2rem] overflow-hidden relative group interactive cursor-none border border-white/10 animate-float shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
          <img 
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=2160" 
            alt="Showreel" 
            className="w-full h-full object-cover grayscale-[40%] transition-transform duration-[2000ms] ease-out animate-subtle-zoom" 
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 2xl:w-28 2xl:h-28 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500">
            <Play className="text-white w-6 h-6 2xl:w-8 2xl:h-8 ml-1 opacity-90" fill="currentColor" />
          </div>
        </div>
      </div>
    </section>
  );
};

const TheProcess = () => {
  const [ref, isVisible] = useScrollReveal();
  const steps = [
    { num: "01", title: "Conceptualization", desc: "Every iconic moment begins with a blank canvas. We dive deep into the core ethos to extract a compelling visual narrative." },
    { num: "02", title: "Spatial Architecture", desc: "Transforming empty voids into immersive environments using cutting-edge light, acoustics, and structural design." },
    { num: "03", title: "Flawless Execution", desc: "Our logistics operate invisibly. Microscopic attention to detail ensures the entire experience flows seamlessly." }
  ];

  return (
    <section className="py-32 2xl:py-48 bg-[#050505] px-6 md:px-12 2xl:px-24 border-t border-white/5">
      <div ref={ref} className={`max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 2xl:mb-32 gap-10">
          <div>
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-6">Methodology</p>
            <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
              The Architecture <br/> of an <span className="text-transparent custom-stroke-text font-normal">Event.</span>
            </h2>
          </div>
          <p className="font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/50 max-w-sm leading-relaxed">
            A meticulous, three-phased approach to engineering the impossible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 border-t border-white/10 pt-16">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col group interactive">
              <span className="text-6xl md:text-7xl 2xl:text-8xl font-wide font-thin text-transparent custom-stroke-text mb-8 transition-colors duration-700 group-hover:text-white/20">{step.num}</span>
              <h3 className="text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-6">{step.title}</h3>
              <p className="font-sans text-[10px] 2xl:text-xs tracking-[0.15em] uppercase text-white/50 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExpertiseSection = ({ setCurrentPage }) => {
  const [ref, isVisible] = useScrollReveal();
  const services = [
    { id: "corporate", num: "01", title: "Corporate Summits", desc: "Orchestrating high-stakes environments for IT, Banking & FMCG giants. Precision, protocol, and perfection.", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600" },
    { id: "weddings", num: "02", title: "Bespoke Weddings", desc: "Curating ultra-luxury, personalized celebrations that transcend the ordinary. Every detail, flawlessly executed.", img: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1600" },
    { id: "concerts", num: "03", title: "Global Concerts", desc: "Engineering massive audiovisual landscapes for live entertainment and showbiz. Immersive and unforgettable.", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1600" }
  ];

  return (
    <section className="bg-[#0a0a0a] relative py-24 lg:py-0 border-y border-white/5">
      <div className="max-w-[2160px] mx-auto px-6 md:px-12 2xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 relative">
          <div className="lg:col-span-5 lg:h-screen lg:sticky top-0 py-12 lg:py-0 flex flex-col justify-center z-10">
            <div ref={ref} className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Capabilities</p>
              <h2 className="text-5xl md:text-7xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-wide font-extralight uppercase tracking-[0.08em] text-white leading-[1.1] break-words">
                Our <br/> Domains.
              </h2>
              <p className="mt-8 font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/50 max-w-xs leading-relaxed">
                Two decades of groundbreaking event architecture.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col pb-32 lg:pb-48 pt-0 lg:pt-48 gap-32 2xl:gap-48">
            {services.map((srv, idx) => (
              <div key={idx} className="flex flex-col relative group interactive" onClick={() => setCurrentPage(srv.id)}>
                <div className="w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-3xl border border-white/5 bg-[#050505] relative cursor-pointer">
                  <img src={srv.img} alt={srv.title} className="w-full h-full object-cover grayscale-[40%] animate-subtle-zoom transition-transform duration-[3000ms] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700"></div>
                </div>
                <div className="mt-8 flex flex-col xl:flex-row xl:items-start justify-between gap-6 xl:gap-12 cursor-pointer">
                  <div className="xl:w-1/2">
                    <span className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.3em] uppercase text-white/40 block mb-3">Domain // {srv.num}</span>
                    <h3 className="text-3xl md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-wide font-extralight uppercase tracking-[0.1em] text-white leading-tight group-hover:text-white/80 transition-colors">
                      {srv.title}
                    </h3>
                  </div>
                  <p className="font-sans text-[10px] 2xl:text-xs tracking-[0.15em] uppercase text-white/60 max-w-sm xl:w-1/2 pt-2 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const InfiniteRunway = ({ setCurrentPage }) => {
  const row1Data = [
    { img: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800", category: "Bespoke Weddings", title: "Royal Palace Union", desc: "An intimate yet grand celebration tailored for royalty." },
    { img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800", category: "Corporate Events", title: "Global Tech Summit", desc: "A futuristic stage setup for over 5,000 attendees." },
    { img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800", category: "Corporate Events", title: "Product Launch '25", desc: "Immersive projection mapping for a global auto brand." },
    { img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800", category: "Bespoke Weddings", title: "Coastal Serenity", desc: "Minimalist, breathtaking beachside altar." },
    { img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", category: "Concerts & Arts", title: "Neon Dreams Fest", desc: "A high-energy visual spectacle for a music festival." }
  ];
  
  const row2Data = [
    { img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800", category: "Concerts & Arts", title: "Echoes of the Valley", desc: "An outdoor amphitheater experience like no other." },
    { img: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=800", category: "Bespoke Weddings", title: "The Glasshouse Vows", desc: "A transparent pavilion under a canopy of stars." },
    { img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800", category: "Corporate Events", title: "Executive Retreat", desc: "An exclusive, high-security gathering in the Alps." },
    { img: "https://images.unsplash.com/photo-1470229722913-7c090be5c560?auto=format&fit=crop&q=80&w=800", category: "Concerts & Arts", title: "Symphony in Lights", desc: "Orchestral performance augmented by laser arrays." },
    { img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800", category: "Corporate Events", title: "Fintech Symposium", desc: "Sleek, ultra-modern staging for banking leaders." }
  ];

  const row3Data = [
    { img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800", category: "Bespoke Weddings", title: "Vintage Estate", desc: "Classic elegance with modern, subtle lighting." },
    { img: "https://images.unsplash.com/photo-1540039155733-d7696c45133a?auto=format&fit=crop&q=80&w=800", category: "Corporate Events", title: "Innovators Gala", desc: "An awards night celebrating technological breakthroughs." },
    { img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80&w=800", category: "Concerts & Arts", title: "Midnight Rhythms", desc: "Deep bass and dynamic stage lighting." },
    { img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800", category: "Bespoke Weddings", title: "Urban Chic Affair", desc: "A rooftop celebration overlooking the city skyline." },
    { img: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800", category: "Corporate Events", title: "Future of Mobility", desc: "A breathtaking reveal sequence for an EV launch." }
  ];

  const RunwayCard = ({ item, sizingClass }) => (
    <div className={`relative group interactive shrink-0 overflow-hidden rounded-2xl border border-white/5 cursor-none ${sizingClass}`}>
      <img src={item.img} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" alt={item.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8 2xl:p-10 pointer-events-none">
        <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <span className="font-sans text-[8px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/60 block mb-3">{item.category}</span>
          <h4 className="font-wide text-lg md:text-xl 2xl:text-2xl font-extralight uppercase tracking-[0.05em] text-white mb-3">{item.title}</h4>
          <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.15em] uppercase text-white/50 line-clamp-2 leading-relaxed">{item.desc}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-24 2xl:py-32 bg-[#050505] overflow-hidden border-y border-white/5">
      <div className="flex flex-col gap-6 2xl:gap-8">
        <div className="flex w-full overflow-hidden select-none hover-pause">
          <div className="flex animate-marquee w-max" style={{ animationDuration: '90s' }}>
            <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
              {row1Data.map((item, i) => <RunwayCard key={`r1a-${i}`} item={item} sizingClass="w-[70vw] md:w-[40vw] xl:w-[30vw] 2xl:w-[25vw] aspect-[16/9]" />)}
            </div>
            <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
              {row1Data.map((item, i) => <RunwayCard key={`r1b-${i}`} item={item} sizingClass="w-[70vw] md:w-[40vw] xl:w-[30vw] 2xl:w-[25vw] aspect-[16/9]" />)}
            </div>
          </div>
        </div>
        <div className="flex w-full overflow-hidden select-none hover-pause">
          <div className="flex animate-marquee-reverse w-max" style={{ animationDuration: '110s' }}>
            <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
              {row2Data.map((item, i) => <RunwayCard key={`r2a-${i}`} item={item} sizingClass="w-[60vw] md:w-[35vw] xl:w-[25vw] 2xl:w-[20vw] aspect-[4/3]" />)}
            </div>
            <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
              {row2Data.map((item, i) => <RunwayCard key={`r2b-${i}`} item={item} sizingClass="w-[60vw] md:w-[35vw] xl:w-[25vw] 2xl:w-[20vw] aspect-[4/3]" />)}
            </div>
          </div>
        </div>
        <div className="flex w-full overflow-hidden select-none hover-pause">
          <div className="flex animate-marquee w-max" style={{ animationDuration: '100s' }}>
            <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
              {row3Data.map((item, i) => <RunwayCard key={`r3a-${i}`} item={item} sizingClass="w-[65vw] md:w-[38vw] xl:w-[28vw] 2xl:w-[22vw] aspect-[16/10]" />)}
            </div>
            <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
              {row3Data.map((item, i) => <RunwayCard key={`r3b-${i}`} item={item} sizingClass="w-[65vw] md:w-[38vw] xl:w-[28vw] 2xl:w-[22vw] aspect-[16/10]" />)}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-20">
         <button onClick={() => setCurrentPage('gallery')} className="interactive border-b border-white/20 pb-2 text-[10px] font-sans tracking-[0.3em] uppercase text-white/60 hover:text-white transition-colors">
            Explore The Archive
         </button>
      </div>
    </section>
  );
};

const Clientele = () => {
  const [ref, isVisible] = useScrollReveal();
  const brands = ["Microsoft", "Mercedes-Benz", "Vogue", "Porsche", "Samsung", "Louis Vuitton", "Chanel", "Rolex"];
  const [activeTestimonial, setActiveTestimonial] = useState(null);

  const testimonials = [
    { main: "Infinity Inc. didn't just host our global summit; they completely redefined our brand's physical presence.", highlight: "Absolute perfection.", author: "Global Tech CEO" },
    { main: "A masterclass in spatial architecture and experience design. They brought our wildest visions to life with", highlight: "flawless precision.", author: "Creative Director, Luxury Fashion House" },
    { main: "The level of detail and invisible logistics provided by Infinity made our bespoke celebration", highlight: "truly unforgettable.", author: "Private Client" },
    { main: "From conceptualization to execution, their team operates on a different frequency. The", highlight: "absolute gold standard.", author: "VP of Marketing, Global Auto Brand" },
    { main: "They don't just plan events; they engineer memories. An absolute powerhouse in the world of", highlight: "luxury experiences.", author: "Head of Operations, Investment Bank" }
  ];

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * testimonials.length);
    setActiveTestimonial(testimonials[randomIdx]);
  }, []);

  const BrandList = () => (
    <div className="flex items-center">
      {brands.map((brand, i) => (
        <React.Fragment key={i}>
          <span className="whitespace-nowrap">{brand}</span>
          <span className="mx-8 md:mx-16 text-white/30">•</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section className="py-32 2xl:py-48 bg-[#0a0a0a] border-t border-white/5 overflow-hidden flex flex-col items-center">
      <div className="w-full overflow-hidden flex z-0 opacity-40 pointer-events-none select-none mb-32 2xl:mb-48">
        <div className="flex animate-marquee w-max items-center text-3xl md:text-5xl 2xl:text-6xl font-wide font-extralight tracking-[0.2em] uppercase text-white leading-none" style={{ animationDuration: '120s' }}>
          <BrandList /><BrandList />
        </div>
      </div>
      <div ref={ref} className={`max-w-4xl 2xl:max-w-6xl mx-auto px-6 text-center transition-all duration-1000 ease-out ${isVisible && activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="flex justify-center mb-10">
          <svg className="w-8 h-8 text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
        </div>
        {activeTestimonial && (
          <>
            <h3 className="text-2xl md:text-4xl 2xl:text-5xl font-wide font-extralight leading-[1.5] text-white/90 tracking-wide uppercase">
              "{activeTestimonial.main} <span className="italic font-normal">{activeTestimonial.highlight}</span>"
            </h3>
            <p className="mt-12 text-[9px] 2xl:text-[11px] font-sans tracking-[0.4em] uppercase text-white/40">— {activeTestimonial.author}</p>
          </>
        )}
      </div>
    </section>
  );
};

const HomePage = ({ setCurrentPage }) => {
  return (
    <div className="animate-fade-in">
      <Hero setCurrentPage={setCurrentPage} />
      <Showreel />
      <TheProcess />
      <ExpertiseSection setCurrentPage={setCurrentPage} />
      <InfiniteRunway setCurrentPage={setCurrentPage} />
      <Clientele />
    </div>
  );
};

/* ==========================================================================
   ABOUT PAGE SPECIFIC 
   ========================================================================== */

const OurGenesis = () => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="py-32 2xl:py-48 bg-[#0a0a0a] px-6 md:px-12 2xl:px-24 border-b border-white/5">
      <div ref={ref} className={`max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-5">
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8 border-b border-white/10 pb-3 inline-block">The Genesis</p>
            <h2 className="text-7xl md:text-8xl 2xl:text-[10rem] font-wide font-extralight text-white leading-none">
              20<span className="text-transparent custom-stroke-text">00.</span>
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-end space-y-8 text-sm md:text-base 2xl:text-lg font-sans font-light text-white/60 leading-relaxed max-w-3xl">
            <p>
              Infinity Inc. was born from a singular obsession: to transcend the mundane. What began in Pune as an intimate endeavor to redefine corporate gatherings for blue-chip IT giants quickly evolved into a nationwide movement.
            </p>
            <p>
              We stripped away the excess, focusing relentlessly on spatial architecture, sensory engagement, and invisible logistics. Two decades later, that same obsession drives every blueprint we draw and every atmosphere we curate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const CoreEthos = () => {
  const [ref, isVisible] = useScrollReveal();
  const pillars = [
    { title: "Absolute Discretion", desc: "For our ultra-high-net-worth and elite corporate clientele, privacy is paramount. We operate under strict NDAs, ensuring your event remains entirely yours." },
    { title: "Microscopic Precision", desc: "Scale means nothing without detail. From the acoustic resonance of a stadium to the thread count of bespoke linens, we engineer perfection." },
    { title: "Infinite Scale", desc: "Whether orchestrating a highly sensitive boardroom retreat for 50 or a global tech summit for 50,000, our logistical framework scales flawlessly." }
  ];

  return (
    <section className="py-32 2xl:py-48 bg-[#050505] px-6 md:px-12 2xl:px-24">
      <div ref={ref} className={`max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-16 md:mb-24 text-center">The Framework</p>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border-y border-white/10">
          {pillars.map((pillar, i) => (
            <div key={i} className="py-16 md:py-20 md:px-12 2xl:px-16 flex flex-col group interactive cursor-none">
               <h3 className="text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-6 group-hover:pl-4 transition-all duration-500">{pillar.title}</h3>
               <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/40 leading-relaxed group-hover:text-white/70 transition-colors duration-500">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TheStudio = () => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="relative h-[70vh] 2xl:h-[80vh] w-full bg-[#0a0a0a] overflow-hidden flex items-center justify-center px-6 border-b border-white/5">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2160" className="w-full h-full object-cover grayscale opacity-30 animate-subtle-zoom" alt="The Studio" />
        <div className="absolute inset-0 bg-[#050505]/60"></div>
      </div>
      <div ref={ref} className={`relative z-10 text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
         <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Headquarters</p>
         <h2 className="text-5xl md:text-7xl 2xl:text-8xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-none mb-6">
            The Creative <span className="text-transparent custom-stroke-text font-normal">Lab.</span>
         </h2>
         <p className="font-sans text-xs 2xl:text-sm tracking-[0.2em] uppercase text-white/60 max-w-xl mx-auto leading-relaxed">
           Every grand architectural feat begins on a sketchpad in our Pune Headquarters. Where imagination meets meticulous engineering.
         </p>
      </div>
    </section>
  );
};

const DirectorProfileRedesigned = () => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="py-32 2xl:py-48 bg-[#0a0a0a] px-6 md:px-12 2xl:px-24 border-b border-white/5 overflow-hidden">
      <div ref={ref} className={`max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-end">
          
          <div className="lg:col-span-6 flex flex-col">
            <h3 className="text-5xl md:text-7xl 2xl:text-8xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-16 leading-[1.1] z-10 relative">
              "It's always <br/> <span className="font-medium text-transparent custom-stroke-text italic">showtime.</span>"
            </h3>
            <div className="w-full aspect-[3/4] overflow-hidden rounded-2xl relative shadow-2xl interactive cursor-none group border border-white/5">
              <img 
                src="https://infinityincevents.com/wp-content/uploads/Frank-DSouza.jpg" 
                alt="Frank D'Souza"
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 animate-subtle-zoom"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 pointer-events-none"></div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 pb-12 lg:pb-24">
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-10 border-b border-white/10 pb-3 inline-block">The Architect</p>
            <div className="space-y-8 text-sm md:text-base 2xl:text-lg font-sans font-light text-white/60 leading-relaxed max-w-xl">
              <p>A visionary in the realm of high-stakes event architecture, Frank D'Souza merges an innate passion for performing arts with meticulous logistical precision.</p>
              <p>Under his direction, Infinity Inc. has grown from a regional boutique agency into a national powerhouse, engineering environments that challenge the boundaries of reality and luxury.</p>
              <p>He believes that the finest events are not merely attended—they are profoundly felt. The true signature of his work lies in the invisible orchestration of perfection.</p>
            </div>
            <div className="mt-16 pt-8 border-t border-white/10 inline-block w-fit">
              <p className="text-white font-sans tracking-[0.3em] uppercase text-xs 2xl:text-sm font-semibold">Frank D'Souza</p>
              <p className="text-white/40 font-sans text-[9px] 2xl:text-[10px] tracking-[0.4em] uppercase mt-2">Director, Infinity Inc.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const AboutPage = () => {
  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505]">
      <section className="px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto pb-32">
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Our Story</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
          Designing <br/> <span className="text-transparent custom-stroke-text font-normal">Legacy.</span>
        </h1>
      </section>
      <Vision />
      <OurGenesis />
      <CoreEthos />
      <DirectorProfileRedesigned />
      <TheStudio />
      <Metrics />
      <GlobalNodes />
    </div>
  );
};

/* ==========================================================================
   DEDICATED DOMAIN DETAILED PAGES
   ========================================================================== */

const CorporatePage = ({ setCurrentPage }) => {
  const [ref1, isVisible1] = useScrollReveal();
  const [ref2, isVisible2] = useScrollReveal();

  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] min-h-screen">
      {/* Detail Hero */}
      <section className="px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto pb-24 border-b border-white/5">
        <button onClick={() => setCurrentPage('expertise')} className="interactive mb-12 flex items-center text-[9px] font-sans tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4 mr-3 rotate-180" /> Back to Domains
        </button>
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Domain // 01</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1] mb-16">
          Corporate <br/> <span className="text-transparent custom-stroke-text font-normal">Summits.</span>
        </h1>
        <div ref={ref1} className={`w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl relative border border-white/5 shadow-2xl transition-all duration-1000 ease-out ${isVisible1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2160" className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" alt="Corporate Summits" />
        </div>
      </section>

      {/* Intro & Metrics */}
      <section className="py-24 2xl:py-32 px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-8">Architecting <br/>Authority.</h2>
            <p className="font-sans text-sm 2xl:text-base tracking-[0.1em] text-white/60 leading-relaxed mb-6">
              We specialize in crafting hyper-secure, immersive environments for Fortune 500 companies, fintech leaders, and global innovators.
            </p>
            <p className="font-sans text-sm 2xl:text-base tracking-[0.1em] text-white/60 leading-relaxed">
              Every detail is engineered to command attention and seamlessly translate complex brand narratives into physical, awe-inspiring reality.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 bg-white/5 p-10 rounded-3xl border border-white/10">
            <div>
              <span className="block text-4xl 2xl:text-5xl font-wide font-extralight text-white mb-3">500+</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Summits Executed</span>
            </div>
            <div>
              <span className="block text-4xl 2xl:text-5xl font-wide font-extralight text-white mb-3">80K</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Delegates Hosted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Engagements Grid */}
      <section className="py-24 2xl:py-32 bg-[#0a0a0a] border-y border-white/5 px-6 md:px-12 2xl:px-24">
         <div ref={ref2} className={`max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
           <h3 className="text-2xl md:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-16 text-center">Specialized Engagements</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 2xl:gap-12">
             {[
               { img: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800", title: "Global Tech Keynotes" },
               { img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800", title: "Executive Retreats" },
               { img: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=800", title: "Product Reveals" }
             ].map((svc, idx) => (
               <div key={idx} className="group interactive cursor-none relative rounded-2xl overflow-hidden border border-white/5 aspect-[4/5]">
                 <img src={svc.img} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt={svc.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                 <div className="absolute bottom-8 left-8">
                   <h4 className="text-xl 2xl:text-2xl font-wide font-extralight uppercase tracking-[0.05em] text-white">{svc.title}</h4>
                 </div>
               </div>
             ))}
           </div>
         </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 text-center px-6">
        <h3 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-10">Architect Your Next Summit</h3>
        <button onClick={() => setCurrentPage('contact')} className="interactive px-12 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500">
          Initialize Sequence
        </button>
      </section>
    </div>
  );
};

const WeddingsPage = ({ setCurrentPage }) => {
  const [ref1, isVisible1] = useScrollReveal();
  const [ref2, isVisible2] = useScrollReveal();

  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] min-h-screen">
      {/* Detail Hero */}
      <section className="px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto pb-24 border-b border-white/5">
        <button onClick={() => setCurrentPage('expertise')} className="interactive mb-12 flex items-center text-[9px] font-sans tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4 mr-3 rotate-180" /> Back to Domains
        </button>
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Domain // 02</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1] mb-16">
          Bespoke <br/> <span className="text-transparent custom-stroke-text font-normal">Weddings.</span>
        </h1>
        <div ref={ref1} className={`w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl relative border border-white/5 shadow-2xl transition-all duration-1000 ease-out ${isVisible1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=2160" className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" alt="Bespoke Weddings" />
        </div>
      </section>

      {/* Intro & Metrics */}
      <section className="py-24 2xl:py-32 px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-8">Curating <br/>Eternity.</h2>
            <p className="font-sans text-sm 2xl:text-base tracking-[0.1em] text-white/60 leading-relaxed mb-6">
              We design highly emotional, cinematic narratives tailored exclusively for the union of two legacies. 
            </p>
            <p className="font-sans text-sm 2xl:text-base tracking-[0.1em] text-white/60 leading-relaxed">
              Every floral arrangement, lighting cue, and architectural choice is flawlessly executed with absolute discretion for our ultra-high-net-worth clientele.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 bg-white/5 p-10 rounded-3xl border border-white/10">
            <div>
              <span className="block text-4xl 2xl:text-5xl font-wide font-extralight text-white mb-3">15+</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Global Destinations</span>
            </div>
            <div>
              <span className="block text-4xl 2xl:text-5xl font-wide font-extralight text-white mb-3">100%</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Absolute Discretion</span>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Engagements Grid */}
      <section className="py-24 2xl:py-32 bg-[#0a0a0a] border-y border-white/5 px-6 md:px-12 2xl:px-24">
         <div ref={ref2} className={`max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
           <h3 className="text-2xl md:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-16 text-center">Specialized Engagements</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 2xl:gap-12">
             {[
               { img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800", title: "Royal Palace Takeovers" },
               { img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800", title: "Private Island Buyouts" },
               { img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800", title: "Heritage Estate Vows" }
             ].map((svc, idx) => (
               <div key={idx} className="group interactive cursor-none relative rounded-2xl overflow-hidden border border-white/5 aspect-[4/5]">
                 <img src={svc.img} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt={svc.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                 <div className="absolute bottom-8 left-8">
                   <h4 className="text-xl 2xl:text-2xl font-wide font-extralight uppercase tracking-[0.05em] text-white">{svc.title}</h4>
                 </div>
               </div>
             ))}
           </div>
         </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 text-center px-6">
        <h3 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-10">Commission Your Celebration</h3>
        <button onClick={() => setCurrentPage('contact')} className="interactive px-12 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500">
          Initialize Sequence
        </button>
      </section>
    </div>
  );
};

const ConcertsPage = ({ setCurrentPage }) => {
  const [ref1, isVisible1] = useScrollReveal();
  const [ref2, isVisible2] = useScrollReveal();

  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] min-h-screen">
      {/* Detail Hero */}
      <section className="px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto pb-24 border-b border-white/5">
        <button onClick={() => setCurrentPage('expertise')} className="interactive mb-12 flex items-center text-[9px] font-sans tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4 mr-3 rotate-180" /> Back to Domains
        </button>
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Domain // 03</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1] mb-16">
          Global <br/> <span className="text-transparent custom-stroke-text font-normal">Concerts.</span>
        </h1>
        <div ref={ref1} className={`w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl relative border border-white/5 shadow-2xl transition-all duration-1000 ease-out ${isVisible1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=2160" className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" alt="Global Concerts" />
        </div>
      </section>

      {/* Intro & Metrics */}
      <section className="py-24 2xl:py-32 px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-8">Engineering <br/>Euphoria.</h2>
            <p className="font-sans text-sm 2xl:text-base tracking-[0.1em] text-white/60 leading-relaxed mb-6">
              We design massive audiovisual landscapes for live entertainment, ensuring flawless acoustic engineering and breathtaking visual syncing.
            </p>
            <p className="font-sans text-sm 2xl:text-base tracking-[0.1em] text-white/60 leading-relaxed">
              From 50,000-seat stadium tours to immersive, multi-stage music festivals, our infrastructure supports the most demanding artists in the world.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 bg-white/5 p-10 rounded-3xl border border-white/10">
            <div>
              <span className="block text-4xl 2xl:text-5xl font-wide font-extralight text-white mb-3">1M+</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Fans Entertained</span>
            </div>
            <div>
              <span className="block text-4xl 2xl:text-5xl font-wide font-extralight text-white mb-3">100+</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Stadium Operations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Engagements Grid */}
      <section className="py-24 2xl:py-32 bg-[#0a0a0a] border-y border-white/5 px-6 md:px-12 2xl:px-24">
         <div ref={ref2} className={`max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
           <h3 className="text-2xl md:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-16 text-center">Specialized Engagements</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 2xl:gap-12">
             {[
               { img: "https://images.unsplash.com/photo-1540039155733-d7696c45133a?auto=format&fit=crop&q=80&w=800", title: "Stadium Tours" },
               { img: "https://images.unsplash.com/photo-1470229722913-7c090be5c560?auto=format&fit=crop&q=80&w=800", title: "Boutique Festivals" },
               { img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800", title: "Immersive Showbiz" }
             ].map((svc, idx) => (
               <div key={idx} className="group interactive cursor-none relative rounded-2xl overflow-hidden border border-white/5 aspect-[4/5]">
                 <img src={svc.img} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt={svc.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                 <div className="absolute bottom-8 left-8">
                   <h4 className="text-xl 2xl:text-2xl font-wide font-extralight uppercase tracking-[0.05em] text-white">{svc.title}</h4>
                 </div>
               </div>
             ))}
           </div>
         </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 text-center px-6">
        <h3 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-10">Architect Your Stage</h3>
        <button onClick={() => setCurrentPage('contact')} className="interactive px-12 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500">
          Initialize Sequence
        </button>
      </section>
    </div>
  );
};


/* ==========================================================================
   EXPERTISE OVERVIEW PAGE
   ========================================================================== */

const ExpertiseHero = () => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto pb-24 md:pb-32 border-b border-white/5">
      <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Our Domains</p>
      <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1] mb-16">
        Architecting <br/> <span className="text-transparent custom-stroke-text font-normal">Realities.</span>
      </h1>
      <div 
        ref={ref}
        className={`w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl relative transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2160" className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" alt="Domain Hero" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      </div>
    </section>
  );
};

const DomainCorporate = ({ setCurrentPage }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="py-24 md:py-40 bg-[#0a0a0a] border-b border-white/5 overflow-hidden">
      <div className="w-full overflow-hidden flex z-0 opacity-[0.07] pointer-events-none select-none mb-20 hover-pause">
        <div className="flex animate-marquee w-max items-center text-[12vw] font-wide font-extralight tracking-[0.1em] uppercase text-white leading-none" style={{ animationDuration: '80s' }}>
          <div className="flex whitespace-nowrap"><span className="pr-12">CORPORATE SUMMITS • TECH LAUNCHES • EXECUTIVE RETREATS • </span></div>
          <div className="flex whitespace-nowrap"><span className="pr-12">CORPORATE SUMMITS • TECH LAUNCHES • EXECUTIVE RETREATS • </span></div>
        </div>
      </div>

      <div ref={ref} className={`px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-5 flex flex-col">
            <span className="text-6xl md:text-8xl font-wide font-thin text-transparent custom-stroke-text mb-8">01</span>
            <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-10 leading-[1.1]">Corporate <br/> Summits.</h2>
            <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/60 leading-relaxed mb-8">
              We engineer high-stakes environments for the world's most demanding corporate giants. From hyper-secure fintech symposiums to massive 5,000-attendee tech keynotes.
            </p>
            <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/40 leading-relaxed mb-16">
              Our methodology merges spatial psychology with cutting-edge audiovisual integration to keep audiences deeply engaged and amplify brand narratives.
            </p>
            
            <button onClick={() => setCurrentPage('corporate')} className="interactive mb-16 px-8 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500 shadow-xl w-fit">
              Explore Corporate Details
            </button>

            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
              <div>
                <span className="block text-3xl 2xl:text-4xl font-wide font-extralight text-white mb-3">500+</span>
                <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Global Summits</span>
              </div>
              <div>
                <span className="block text-3xl 2xl:text-4xl font-wide font-extralight text-white mb-3">120+</span>
                <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Brand Partners</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 2xl:gap-8">
            <div className="md:col-span-2 aspect-[16/9] overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('corporate')}>
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Corporate Main" />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('corporate')}>
              <img src="https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Corporate Detail 1" />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('corporate')}>
              <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Corporate Detail 2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DomainWeddings = ({ setCurrentPage }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="py-24 md:py-40 bg-[#050505] overflow-hidden border-b border-white/5">
      <div className="w-full overflow-hidden flex z-0 opacity-[0.07] pointer-events-none select-none mb-20 hover-pause">
        <div className="flex animate-marquee-reverse w-max items-center text-[12vw] font-wide font-extralight tracking-[0.1em] uppercase text-white leading-none" style={{ animationDuration: '90s' }}>
          <div className="flex whitespace-nowrap"><span className="pr-12">BESPOKE WEDDINGS • ROYAL UNIONS • DESTINATION CELEBRATIONS • </span></div>
          <div className="flex whitespace-nowrap"><span className="pr-12">BESPOKE WEDDINGS • ROYAL UNIONS • DESTINATION CELEBRATIONS • </span></div>
        </div>
      </div>

      <div ref={ref} className={`px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1 grid grid-cols-2 gap-6 2xl:gap-8 h-full">
            <div className="flex flex-col gap-6 2xl:gap-8 pt-12 lg:pt-20">
               <div className="aspect-[3/4] overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('weddings')}>
                 <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Wedding 1" />
               </div>
               <div className="aspect-square overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('weddings')}>
                 <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Wedding 2" />
               </div>
            </div>
            <div className="flex flex-col gap-6 2xl:gap-8 pb-12 lg:pb-20">
               <div className="aspect-square overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('weddings')}>
                 <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Wedding 3" />
               </div>
               <div className="aspect-[3/4] overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('weddings')}>
                 <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Wedding 4" />
               </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col order-1 lg:order-2 lg:pl-10">
            <span className="text-6xl md:text-8xl font-wide font-thin text-transparent custom-stroke-text mb-8">02</span>
            <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-10 leading-[1.1]">Bespoke <br/> Weddings.</h2>
            <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/60 leading-relaxed mb-8">
              Curating ultra-luxury, personalized celebrations that transcend the ordinary. Every floral arrangement, every lighting cue, and every architectural choice is flawlessly executed.
            </p>
            <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/40 leading-relaxed mb-10">
              We don't offer packages. We start with a blank canvas and design a highly emotional, cinematic narrative tailored exclusively for the union of two legacies.
            </p>

            <button onClick={() => setCurrentPage('weddings')} className="interactive mb-16 px-8 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500 shadow-xl w-fit">
              Explore Weddings Details
            </button>

            <ul className="space-y-6 border-t border-white/10 pt-10">
              {['Private Island Buyouts', 'Royal Palace Takeovers', 'Custom Spatial Architecture', 'High-End Talent Procurement'].map((item, i) => (
                <li key={i} className="flex items-center text-[10px] 2xl:text-[11px] font-sans tracking-[0.2em] uppercase text-white/70">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full mr-6"></div>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const DomainConcerts = ({ setCurrentPage }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="py-24 md:py-40 bg-[#0a0a0a] border-b border-white/5 overflow-hidden">
      <div className="w-full overflow-hidden flex z-0 opacity-[0.07] pointer-events-none select-none mb-20 hover-pause">
        <div className="flex animate-marquee w-max items-center text-[12vw] font-wide font-extralight tracking-[0.1em] uppercase text-white leading-none" style={{ animationDuration: '70s' }}>
          <div className="flex whitespace-nowrap"><span className="pr-12">GLOBAL CONCERTS • STADIUM TOURS • LIVE SHOWBIZ • </span></div>
          <div className="flex whitespace-nowrap"><span className="pr-12">GLOBAL CONCERTS • STADIUM TOURS • LIVE SHOWBIZ • </span></div>
        </div>
      </div>

      <div ref={ref} className={`px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
          <div className="flex flex-col">
             <span className="text-6xl md:text-8xl font-wide font-thin text-transparent custom-stroke-text mb-8">03</span>
             <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1] mb-8">Global <br/> Concerts.</h2>
             <button onClick={() => setCurrentPage('concerts')} className="interactive px-8 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500 shadow-xl w-fit mt-4">
              Explore Concerts Details
            </button>
          </div>
          <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/50 leading-relaxed max-w-md lg:text-right">
            Engineering massive audiovisual landscapes for live entertainment. From 50,000-seat stadium tours to immersive, multi-stage music festivals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-8">
           <div className="lg:col-span-2 aspect-[16/9] lg:aspect-auto overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('concerts')}>
             <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Concert Main" />
           </div>
           <div className="flex flex-col gap-6 2xl:gap-8">
             <div className="aspect-[16/9] lg:aspect-auto lg:flex-1 overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('concerts')}>
               <img src="https://images.unsplash.com/photo-1540039155733-d7696c45133a?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Concert Detail 1" />
             </div>
             <div className="aspect-[16/9] lg:aspect-auto lg:flex-1 overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('concerts')}>
               <img src="https://images.unsplash.com/photo-1470229722913-7c090be5c560?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Concert Detail 2" />
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

const CapabilitiesMatrix = () => {
  const [ref, isVisible] = useScrollReveal();
  const capabilities = [
    { title: "Spatial Architecture", details: "Stage & Set Design, 3D Rendering, Venue Mapping" },
    { title: "Audiovisual Eng.", details: "Sound Scaping, Projection Mapping, Intelligent Lighting" },
    { title: "Invisible Logistics", details: "Global Freight, Permit Acquisition, Security Protocols" },
    { title: "Guest Experience", details: "VIP Concierge, RSVP Management, Bespoke Gifting" },
    { title: "Talent & Showbiz", details: "Artist Procurement, Choreography, Show Calling" },
    { title: "Financial Modeling", details: "Budget Architecture, ROI Tracking, Vendor Negotiations" }
  ];

  return (
    <section className="py-32 2xl:py-48 bg-[#050505] px-6 md:px-12 2xl:px-24">
      <div ref={ref} className={`max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-16 text-center">Service Matrix</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 lg:gap-y-24 border-t border-white/10 pt-16">
          {capabilities.map((cap, i) => (
            <div key={i} className="flex flex-col interactive group cursor-none">
              <div className="w-full h-[1px] bg-white/10 mb-8 group-hover:bg-white/30 transition-colors duration-500 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[800ms] ease-out"></div>
              </div>
              <h4 className="text-xl md:text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-4 group-hover:pl-3 transition-all duration-500">{cap.title}</h4>
              <p className="font-sans text-[10px] 2xl:text-[11px] tracking-[0.15em] uppercase text-white/40 leading-relaxed group-hover:text-white/70 transition-colors duration-500">{cap.details}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExpertisePage = ({ setCurrentPage }) => {
  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505]">
       <ExpertiseHero />
       <DomainCorporate setCurrentPage={setCurrentPage} />
       <DomainWeddings setCurrentPage={setCurrentPage} />
       <DomainConcerts setCurrentPage={setCurrentPage} />
       <CapabilitiesMatrix />
    </div>
  );
};

/* ==========================================================================
   GALLERY PAGE
   ========================================================================== */

const GalleryPage = () => {
  const [filter, setFilter] = useState('All');
  const [ref1, isVisible1] = useScrollReveal();
  const [ref2, isVisible2] = useScrollReveal();

  const filters = ['All', 'Corporate', 'Weddings', 'Concerts'];

  const projects = [
    { img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800", category: "Corporate", title: "Global Tech Summit" },
    { img: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800", category: "Weddings", title: "The Royal Union" },
    { img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800", category: "Concerts", title: "Echoes Festival" },
    { img: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800", category: "Corporate", title: "Auto Reveal '25" },
    { img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800", category: "Weddings", title: "Coastal Vows" },
    { img: "https://images.unsplash.com/photo-1540039155733-d7696c45133a?auto=format&fit=crop&q=80&w=800", category: "Concerts", title: "Midnight Symphony" },
    { img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800", category: "Corporate", title: "Leadership Retreat" },
    { img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800", category: "Weddings", title: "Urban Chic Affair" },
    { img: "https://images.unsplash.com/photo-1470229722913-7c090be5c560?auto=format&fit=crop&q=80&w=800", category: "Concerts", title: "Neon Dreams" }
  ];

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] min-h-screen">
      <section className="px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto pb-24 border-b border-white/5">
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">The Archive</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
          Visual <br/> <span className="text-transparent custom-stroke-text font-normal">Symphony.</span>
        </h1>
      </section>

      <section className="py-24 2xl:py-32 px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto border-b border-white/5">
        <div ref={ref1} className={`transition-all duration-1000 ease-out ${isVisible1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
            <div>
              <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-4">Featured Selection</p>
              <h2 className="text-3xl md:text-5xl 2xl:text-6xl font-wide font-extralight uppercase tracking-[0.05em] text-white">The Monaco Estate</h2>
            </div>
            <button className="interactive border-b border-white/20 pb-2 text-[10px] font-sans tracking-[0.3em] uppercase text-white hover:text-white/50 transition-colors">
              View Case Study
            </button>
          </div>
          <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl relative group interactive cursor-none border border-white/5">
            <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=2160" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-[2000ms] group-hover:scale-105 animate-subtle-zoom" alt="Featured Project" />
            <div className="absolute inset-0 bg-black/20 pointer-events-none transition-colors duration-700 group-hover:bg-transparent"></div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 2xl:px-24 py-24 2xl:py-32 max-w-[2160px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <h3 className="text-2xl md:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white">Curated Collection</h3>
          <div className="flex flex-wrap gap-6 md:gap-10">
            {filters.map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`interactive font-sans text-[10px] 2xl:text-xs tracking-[0.3em] uppercase transition-all duration-300 pb-2 border-b-2 ${filter === f ? 'text-white border-white' : 'text-white/40 border-transparent hover:text-white/80'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {filteredProjects.map((proj, i) => (
            <div key={`${filter}-${i}`} className={`relative overflow-hidden group interactive border border-white/5 rounded-2xl animate-fade-in ${i % 3 === 0 ? 'aspect-[3/4]' : i % 2 === 0 ? 'aspect-square' : 'aspect-[4/3]'}`}>
               <img src={proj.img} alt={proj.title} className="w-full h-full object-cover grayscale-[40%] transition-transform duration-[2000ms] group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                 <span className="font-sans text-[8px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/50 block mb-2">{proj.category}</span>
                 <h4 className="font-wide text-xl 2xl:text-2xl font-extralight uppercase tracking-[0.05em] text-white">{proj.title}</h4>
               </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 2xl:py-32 bg-[#0a0a0a] border-t border-white/5 px-6 md:px-12 2xl:px-24">
        <div ref={ref2} className={`max-w-[2160px] mx-auto transition-all duration-1000 ease-out ${isVisible2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="text-center mb-20">
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-6">Cinematography</p>
            <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
              The Motion <br/> <span className="text-transparent custom-stroke-text font-normal">Vault.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 2xl:gap-12">
            {[
              { img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200", title: "Corporate Showreel '24" },
              { img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1200", title: "Live Entertainment Edit" }
            ].map((video, idx) => (
              <div key={idx} className="w-full aspect-[16/9] rounded-3xl overflow-hidden relative group interactive cursor-none border border-white/5 shadow-2xl">
                <img src={video.img} className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 transition-all duration-[2000ms] group-hover:scale-105" alt={video.title} />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 2xl:w-24 2xl:h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-500">
                  <Play className="text-white w-6 h-6 2xl:w-8 2xl:h-8 ml-1 opacity-90" fill="currentColor" />
                </div>
                <div className="absolute bottom-6 left-8">
                  <h4 className="font-wide text-lg 2xl:text-xl font-extralight uppercase tracking-[0.05em] text-white">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ==========================================================================
   CONTACT PAGE
   ========================================================================== */

const ContactPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const faqs = [
    { q: "What is your minimum engagement scope?", a: "We specialize in grand-scale and ultra-luxury events. While we do not have a strict financial minimum, our engagements typically begin with complex spatial or logistical requirements that standard agencies cannot accommodate." },
    { q: "Do you execute international commissions?", a: "Yes. With a robust network of global logistics partners and our core nodes across major cities, we have seamlessly executed events in the Middle East, Europe, and Southeast Asia." },
    { q: "What is the typical lead time required?", a: "For large-scale corporate summits or bespoke destination weddings, we recommend a lead time of 6 to 12 months. This allows for uncompromising attention to architectural design and talent procurement." },
    { q: "Do you operate under strict NDAs?", a: "Absolute discretion is a cornerstone of our philosophy. We routinely operate under strict Non-Disclosure Agreements for our high-profile, celebrity, and corporate elite clientele." }
  ];

  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] min-h-screen flex flex-col">
      <section className="px-6 md:px-12 2xl:px-24 max-w-[2160px] mx-auto w-full pb-32 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20">
          <div className="lg:col-span-6 xl:col-span-5">
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Initialize Sequence</p>
            <h1 className="text-5xl md:text-7xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1] mb-12">
              Connect.<br/><span className="text-transparent custom-stroke-text font-normal whitespace-nowrap">The Vision.</span>
            </h1>
            <div className="space-y-12">
              <div>
                 <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 mb-3 border-b border-white/10 inline-block pb-2">Direct Line</p>
                 <p className="font-sans text-sm md:text-base tracking-[0.1em] text-white font-light hover:text-white/60 transition-colors interactive w-fit cursor-pointer">info@infinityincevents.com</p>
              </div>
              <div>
                 <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 mb-3 border-b border-white/10 inline-block pb-2">Headquarters</p>
                 <p className="font-sans text-sm md:text-base tracking-[0.1em] text-white font-light leading-relaxed">Pune, Maharashtra<br/>India</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 xl:col-span-7 lg:pl-8 xl:pl-16">
            <form className="flex flex-col gap-12 mt-8 lg:mt-0" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 pl-2">Full Name</label>
                <input type="text" className="interactive bg-transparent border-b border-white/20 focus:border-white outline-none py-4 px-2 text-sm text-white font-sans transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 pl-2">Email Address</label>
                <input type="email" className="interactive bg-transparent border-b border-white/20 focus:border-white outline-none py-4 px-2 text-sm text-white font-sans transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 pl-2">Inquiry Type</label>
                <select className="interactive bg-transparent border-b border-white/20 focus:border-white outline-none py-4 px-2 text-sm text-white/80 font-sans transition-colors appearance-none rounded-none">
                  <option className="bg-black text-white">Corporate Summit</option>
                  <option className="bg-black text-white">Bespoke Wedding</option>
                  <option className="bg-black text-white">General Inquiry</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 pl-2">Message</label>
                <textarea rows="4" className="interactive bg-transparent border-b border-white/20 focus:border-white outline-none py-4 px-2 text-sm text-white font-sans transition-colors resize-none"></textarea>
              </div>
              <button className="interactive w-fit mt-4 px-12 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500">
                Transmit Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-24 2xl:py-32 px-6 md:px-12 2xl:px-24 bg-[#0a0a0a] border-b border-white/5">
        <div className="max-w-[2160px] mx-auto">
          <div className="text-center mb-20">
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-6">Strategic Presence</p>
            <h2 className="text-3xl md:text-5xl 2xl:text-6xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
              Global <span className="text-transparent custom-stroke-text font-normal">Presence.</span>
            </h2>
          </div>
          <GlobalMap />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 2xl:gap-12">
            {[
              { city: "Pune", type: "HQ & Design Lab", email: "pune@infinityincevents.com" },
              { city: "Mumbai", type: "Showbiz Division", email: "mumbai@infinityincevents.com" },
              { city: "Delhi-NCR", type: "Corporate Division", email: "delhi@infinityincevents.com" },
              { city: "Goa", type: "Destination Logistics", email: "goa@infinityincevents.com" }
            ].map((node, i) => (
              <div key={i} className="p-10 border border-white/10 rounded-2xl hover:border-white/30 transition-colors duration-500 interactive group bg-[#050505]">
                <h3 className="text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-2">{node.city}</h3>
                <p className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40 mb-8">{node.type}</p>
                <p className="font-sans text-[10px] 2xl:text-xs tracking-[0.1em] text-white/70 group-hover:text-white transition-colors">{node.email}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 2xl:py-32 px-6 md:px-12 2xl:px-24 bg-[#050505]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-4">Operations</p>
            <h2 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white">Engagement Protocols</h2>
          </div>
          <div className="flex flex-col border-t border-white/10">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/10 overflow-hidden interactive" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div className="py-8 flex justify-between items-center cursor-none">
                  <h4 className={`text-sm md:text-base 2xl:text-lg font-wide font-extralight uppercase tracking-[0.05em] transition-colors duration-300 pr-8 ${activeFaq === i ? 'text-white' : 'text-white/60'}`}>{faq.q}</h4>
                  <div className="text-white/40 font-mono text-xl font-light">{activeFaq === i ? '−' : '+'}</div>
                </div>
                <div className={`transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-64 opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                  <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/40 leading-relaxed max-w-2xl">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/5 border-y border-white/10 px-6 text-center">
        <h3 className="text-xl md:text-2xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-4">Join The Architecture</h3>
        <p className="font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/50 max-w-xl mx-auto mb-8 leading-relaxed">
          We are always searching for visionary designers, logistical masterminds, and production specialists.
        </p>
        <a href="mailto:careers@infinityincevents.com" className="interactive border-b border-white/20 pb-2 text-[10px] font-sans tracking-[0.3em] uppercase text-white hover:text-white/50 transition-colors">
          Submit Portfolio
        </a>
      </section>
    </div>
  );
};

/* ==========================================================================
   MAIN APP ROUTER
   ========================================================================== */

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page) => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentPage(page);
  };

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Expertise', id: 'expertise' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <div className="bg-[#050505] min-h-screen font-sans antialiased selection:bg-white/20 selection:text-white scroll-smooth text-white flex flex-col">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=Montserrat:wght@100;200;300;400;900&display=swap');

        .font-wide { font-family: 'Montserrat', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }

        body { cursor: none !important; overflow-x: hidden; background-color: #050505; }
        * { cursor: none !important; }

        /* Restore Native Cursors for Map Interaction */
        #global-map { cursor: grab !important; }
        #global-map:active { cursor: grabbing !important; }
        #global-map * { cursor: inherit !important; }
        #global-map .leaflet-interactive { cursor: pointer !important; }

        .custom-stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
          color: transparent;
        }

        @keyframes subtleZoom { 0% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marqueeReverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .animate-subtle-zoom { animation: subtleZoom 20s ease-in-out infinite alternate; }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-marquee { animation: marquee linear infinite; }
        .animate-marquee-reverse { animation: marqueeReverse linear infinite; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 1.5s ease-out forwards; }
        
        .hover-pause:hover .animate-marquee,
        .hover-pause:hover .animate-marquee-reverse { animation-play-state: paused !important; }

        .custom-tooltip {
          background-color: rgba(5, 5, 5, 0.9) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: white !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 9px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.2em !important;
          border-radius: 4px !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8) !important;
          backdrop-filter: blur(10px);
        }
        .leaflet-tooltip-top:before { border-top-color: rgba(5, 5, 5, 0.9) !important; }
        .leaflet-container { background: transparent !important; }

        .cursor-dot { background-color: #ffffff; }
        .cursor-ring { border-color: rgba(255,255,255,0.4); background-color: rgba(255,255,255,0.1); }
      `}} />

      {isLoading && <Preloader finishLoading={() => setIsLoading(false)} />}

      <CustomCursor />
      
      <nav className={`fixed w-full z-[100] transition-all duration-700 px-6 md:px-12 2xl:px-24 py-6 2xl:py-8 ${scrolled || currentPage !== 'home' ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/5 py-4 2xl:py-6' : ''}`}>
        <div className="max-w-[2160px] mx-auto flex justify-between items-center text-white">
          <div className="interactive z-50 flex items-center cursor-none" onClick={() => navigateTo('home')}>
            <img 
              src="https://infinityincevents.com/wp-content/uploads/Logo-Transparent-2048x569.png" 
              alt="Infinity Inc Logo" 
              className="h-[25px] md:h-[35px] 2xl:h-[40px] object-contain invert brightness-0 hover:opacity-70 transition-opacity" 
            />
          </div>
          <div className="hidden lg:flex items-center space-x-12 2xl:space-x-16">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => navigateTo(item.id)} 
                className={`text-[9px] 2xl:text-[11px] font-sans tracking-[0.3em] uppercase transition-colors interactive font-medium ${currentPage === item.id || (currentPage === 'corporate' && item.id === 'expertise') || (currentPage === 'weddings' && item.id === 'expertise') || (currentPage === 'concerts' && item.id === 'expertise') ? 'text-white border-b border-white/30 pb-1' : 'text-white/50 hover:text-white pb-1 border-b border-transparent'}`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <button className="lg:hidden interactive z-50 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} strokeWidth={1} /> : <Menu size={28} strokeWidth={1} />}
          </button>
        </div>

        <div className={`fixed inset-0 bg-[#050505] z-40 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col justify-center items-center lg:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
           <div className="flex flex-col items-center space-y-10">
            {navItems.map((item, i) => (
              <button 
                key={item.id} 
                onClick={() => navigateTo(item.id)}
                className={`text-3xl font-wide font-extralight tracking-[0.1em] uppercase transition-colors interactive ${currentPage === item.id || (currentPage === 'corporate' && item.id === 'expertise') || (currentPage === 'weddings' && item.id === 'expertise') || (currentPage === 'concerts' && item.id === 'expertise') ? 'text-white' : 'text-white/50 hover:text-white'}`}
                style={{ transitionDelay: `${i * 100}ms`, transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', opacity: mobileMenuOpen ? 1 : 0 }}
              >
                {item.name}
              </button>
            ))}
           </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col">
        {currentPage === 'home' && <HomePage setCurrentPage={navigateTo} />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'expertise' && <ExpertisePage setCurrentPage={navigateTo} />}
        {currentPage === 'corporate' && <CorporatePage setCurrentPage={navigateTo} />}
        {currentPage === 'weddings' && <WeddingsPage setCurrentPage={navigateTo} />}
        {currentPage === 'concerts' && <ConcertsPage setCurrentPage={navigateTo} />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      <Footer setCurrentPage={navigateTo} />
    </div>
  );
}
