import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const MODES = [
  {
    id: "color-blindness",
    label: "Color Blindness",
    title: "Total color blindness",
    description: "People with lowered color vision have difficulty distinguishing some or all colors. Total color blindness (Monochromatic / Achromatopsy) is very rare. People with this visual impairment cannot perceive any colors, only different shades of gray.",
    tips: [
      "Do not use color as the only way to convey information, indicate an action or identify an element. For example, do not mark an incorrect form field with a red border only — supplement with text and preferably an icon.",
      "Consider offering a high contrast mode.",
    ],
  },
  {
    id: "tunnel-vision",
    label: "Tunnel Vision",
    title: "Tunnel Vision",
    description: "What is commonly called Tunnel Vision is loss of peripheral vision. This may be because the person suffers from a disease that affects the cells in the eye, but may also occur temporarily due to stress or depression.",
    tips: [
      "Avoid text in small font sizes and long texts. Use proper spacing and line height.",
      "Make sure the website can be zoomed to at least 200%.",
      "Offer a text to speech reader.",
    ],
  },
  {
    id: "far-sightedness",
    label: "Far-Sightedness",
    title: "Far-sightedness",
    description: "Far-sightedness (Hyperopia) is one of the most common visual impairments. People with Hyperopia have difficulty focusing on objects at close range which makes them appear blurry.",
    tips: [
      "Avoid text in small font sizes and long texts. Use proper spacing and line height.",
      "Make sure the website can be zoomed to at least 200%.",
      "Offer a text to speech reader.",
    ],
  },
  {
    id: "sunshine",
    label: "Sunshine",
    title: "Sunshine",
    description: "A lot of people have to use their computers outside in bright sunshine. It can make it harder to see what's on the screen.",
    tips: [
      "Provide enough contrast between text and its background. Use a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.",
      "Check the contrast with Colour Contrast Analyser or Contrast Ratio tools.",
    ],
  },
  {
    id: "concentration",
    label: "Concentration",
    title: "Concentration",
    description: "Everyone can have a hard time concentrating, but for some it can be a big problem in everyday life. Disabilities like ADHD and Autism can cause difficulty in handling impressions, sorting information and sensitivity to sound.",
    tips: [
      "Give the website a simple and clean design.",
      "Be careful with animations and strong colors.",
      "Avoid having too much content on the same page.",
      "Offer image, audio and video alternatives to text content.",
    ],
  },
];

function InfoModal({ mode, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog" aria-modal="true"
    >
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border-t-4 border-blue-600 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-blue-600">×</button>
        <h3 className="text-blue-900 text-xl font-bold mb-3">{mode.title}</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">{mode.description}</p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800 font-bold text-sm mb-2 uppercase tracking-wide">How to avoid?</p>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
            {mode.tips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Toggle({ active, onChange, label }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={active}
      aria-label={label}
      className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:ring-4 focus:ring-blue-300 outline-none ${active ? 'bg-blue-600' : 'bg-slate-400'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${active ? 'left-7' : 'left-1'}`} />
    </button>
  );
}

export default function AccessibilityLab() {
  const [activeMode, setActiveMode] = useState(null);
  const [openInfo, setOpenInfo] = useState(null);
  const mainRef = useRef(null);
  const tunnelOverlayRef = useRef(null);
  const distractionIntervalRef = useRef(null);
  const adRef = useRef(null);

  const clearEffects = useCallback(() => {
    const main = mainRef.current;
    if (!main) return;
    
    main.style.filter = "";
    
    if (tunnelOverlayRef.current) {
      if (typeof tunnelOverlayRef.current._cleanup === "function") {
        tunnelOverlayRef.current._cleanup();
      }
      tunnelOverlayRef.current.remove();
      tunnelOverlayRef.current = null;
    }
    
    if (adRef.current) {
      adRef.current.remove();
      adRef.current = null;
    }
    
    if (distractionIntervalRef.current) {
      clearInterval(distractionIntervalRef.current);
      distractionIntervalRef.current = null;
    }
    
    main.querySelectorAll(".distraction-text").forEach((el) => {
      el.style.opacity = "";
      el.classList.remove("distraction-text");
    });
  }, []);

  const applyEffect = useCallback((modeId) => {
    const main = mainRef.current;
    if (!main) return;
    clearEffects();
    
    if (modeId === "color-blindness") main.style.filter = "grayscale(100%)";
    if (modeId === "far-sightedness") main.style.filter = "blur(4px)";
    if (modeId === "sunshine") main.style.filter = "brightness(1.8) contrast(0.7)";
    
    if (modeId === "tunnel-vision") {
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        pointer-events: none;
        background: rgba(0,0,0,0.97);
        z-index: 9998;
        -webkit-mask-image: radial-gradient(circle 100px at 50% 50%, transparent 99px, black 100px);
        mask-image: radial-gradient(circle 100px at 50% 50%, transparent 99px, black 100px);
      `;

      const setOverlayBounds = () => {
        const rect = main.getBoundingClientRect();
        overlay.style.top = `${rect.top}px`;
        overlay.style.left = `${rect.left}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
      };

      const setMaskFromClientPoint = (clientX, clientY) => {
        const rect = main.getBoundingClientRect();
        const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
        overlay.style.webkitMaskImage = `radial-gradient(circle 100px at ${x}px ${y}px, transparent 99px, black 100px)`;
        overlay.style.maskImage = `radial-gradient(circle 100px at ${x}px ${y}px, transparent 99px, black 100px)`;
      };

      setOverlayBounds();
      setMaskFromClientPoint(window.innerWidth / 2, window.innerHeight / 2);

      tunnelOverlayRef.current = overlay;
      document.body.appendChild(overlay);

      const handleMouseMove = (e) => {
        setMaskFromClientPoint(e.clientX, e.clientY);
      };

      const handleTouchMove = (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        setMaskFromClientPoint(touch.clientX, touch.clientY);
      };

      window.addEventListener("resize", setOverlayBounds);
      window.addEventListener("scroll", setOverlayBounds, true);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleTouchMove, { passive: true });
      overlay._cleanup = () => {
        window.removeEventListener("resize", setOverlayBounds);
        window.removeEventListener("scroll", setOverlayBounds, true);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("touchmove", handleTouchMove);
      };
    }

    if (modeId === "concentration") {
      const ad = document.createElement("div");
      ad.style.cssText = `
        position: fixed; 
        bottom: 40px; 
        right: 40px; 
        z-index: 99999;
        background: #fff; 
        border: 3px solid #fbbf24; 
        padding: 20px 28px;
        border-radius: 16px; 
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        font-size: 1.1rem; 
        font-weight: bold; 
        color: #b91c1c;
      `;
      ad.innerHTML = `🔥 Limited Offer!<br>Click here for a surprise!`;
      document.body.appendChild(ad);
      adRef.current = ad;

      main.querySelectorAll("h1, h2, p, a, button").forEach((el) => {
        el.classList.add("distraction-text");
      });
      distractionIntervalRef.current = setInterval(() => {
        main.querySelectorAll(".distraction-text").forEach((el) => {
          el.style.opacity = String(Math.random() * 0.5 + 0.5);
        });
      }, 400);
    }
  }, [clearEffects]);

  const handleToggle = (id) => {
    const next = activeMode === id ? null : id;
    setActiveMode(next);
    applyEffect(next);
  };

  useEffect(() => {
    return () => {
      clearEffects();
    };
  }, [clearEffects]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 overflow-hidden font-sans">
      
      <nav className="w-full md:w-72 bg-slate-900 text-white flex flex-col p-6 z-50 shadow-xl overflow-y-auto border-r border-slate-800">
        <h2 className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-6">Test Controls</h2>
        
        <ul className="space-y-3 flex-1">
          {MODES.map((mode) => (
            <li key={mode.id} className="flex flex-col">
              <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold tracking-wide">{mode.label}</span>
                  <button 
                    onClick={() => setOpenInfo(mode.id)}
                    className="text-slate-400 hover:text-blue-400 transition-colors p-1"
                    aria-label="Learn more"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                    </svg>
                  </button>
                </div>
                <Toggle active={activeMode === mode.id} onChange={() => handleToggle(mode.id)} label={mode.label} />
              </div>
            </li>
          ))}
        </ul>

        <button 
          onClick={() => { setActiveMode(null); clearEffects(); }}
          className="mt-8 w-full py-4 bg-slate-800 border-2 border-red-500/50 text-red-400 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
        >
          Reset Environment
        </button>
      </nav>

      <main ref={mainRef} className="flex-1 flex flex-col relative overflow-y-auto">
        
        <header className="flex items-center justify-end p-6 bg-white border-b border-slate-200">
          <Link to="/experience" className="bg-blue-600 px-6 py-2 rounded-full text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            3D Experience →
          </Link>
        </header>

        <div className="p-6">
          <div className="relative rounded-3xl overflow-hidden h-[400px] flex items-center justify-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" className="absolute inset-0 w-full h-full object-cover" alt="Mountain landscape" />
            <div className="absolute inset-0 bg-slate-900/40 backdrop-brightness-75" />
            <div className="relative z-10 text-center px-6 max-w-2xl">
              <h2 className="text-5xl font-black text-white mb-6 leading-tight uppercase tracking-tighter">
                Accessibility <br/> <span className="text-blue-400">Test Laboratory</span>
              </h2>
              <p className="text-lg text-white/90 font-medium leading-relaxed mb-8">
                Experience real-world digital barriers. Use the controls on the left to simulate impairments and learn how to build for everyone.
              </p>
              <button className="px-10 py-4 bg-white text-blue-900 font-black rounded-full uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl">
                Start Diagnostic
              </button>
            </div>
          </div>
        </div>

        <section className="p-8 max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase italic">Why this matters?</h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-10">
              Inclusive design isn't a feature; it's a fundamental right. This lab provides a sandbox to test how color, focus, and environment affect usability.
            </p>
        </section>
      </main>

      {openInfo && <InfoModal mode={MODES.find(m => m.id === openInfo)} onClose={() => setOpenInfo(null)} />}
    </div>
  );
}
