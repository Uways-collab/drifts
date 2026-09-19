import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/audio';
import { Shield, Volume2, VolumeX, Menu, X, Terminal, Radio } from 'lucide-react';

interface NavbarProps {
  onNavClick: (sectionId: string) => void;
  onAcquireClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavClick, onAcquireClick }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getIsMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      const millis = String(Math.floor(now.getUTCMilliseconds() / 10)).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}:${secs}.${millis} UTC`);
    };
    const timer = setInterval(updateTimer, 60);
    return () => clearInterval(timer);
  }, []);

  const handleSoundToggle = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.startEngine();
    }
  };

  const navItems = [
    { label: '360° FRAME LAB', id: 'hero-canvas-section' },
    { label: 'INVENTORY SPEC', id: 'inventory-section' },
    { label: 'SURVEILLANCE CCTV', id: 'surveillance-section' },
    { label: 'DRIFT TELEMETRY', id: 'telemetry-section' },
    { label: 'ACQUISITION ESCROW', id: 'acquisition-section' }
  ];

  const handleItemClick = (id: string) => {
    soundEngine.playClick(1100);
    setMobileMenuOpen(false);
    onNavClick(id);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 border-b border-[#18181b] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Terminal Identifier */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleItemClick('hero-canvas-section')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-7 h-7 bg-[#FF2A00] flex items-center justify-center font-display font-bold text-black text-lg tracking-tighter group-hover:scale-105 transition-transform">
              E
            </div>
            <div>
              <span className="font-display font-bold text-lg text-white tracking-wider block leading-none">
                EMPATHON <span className="text-[#FF2A00]">AUTOS</span>
              </span>
              <span className="font-tech text-[10px] text-[#71717a] tracking-widest block uppercase">
                NOCTURNE HYPER-ATELIER
              </span>
            </div>
          </button>

          {/* Live UTC Ticker */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-[#121214] border border-[#27272a] rounded text-[11px] font-tech text-[#a1a1aa]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
            <span>{currentTime}</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              className="font-tech text-xs text-[#a1a1aa] hover:text-white hover:text-[#FF2A00] tracking-wider transition-colors uppercase whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Sound Synthesizer Engine Toggle */}
          <button
            id="btn-nav-audio"
            type="button"
            onClick={handleSoundToggle}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-[#121214] hover:bg-[#18181b] border border-[#27272a] hover:border-[#FF2A00] rounded text-xs font-tech text-[#a1a1aa] hover:text-white transition-colors"
            title="Toggle Engine Audio Synthesis"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#71717a]" />
                <span className="hidden sm:inline">AUDIO: OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#FF2A00]" />
                <span className="hidden sm:inline text-white font-bold">AUDIO: ON</span>
              </>
            )}
          </button>

          {/* Primary CTA */}
          <button
            id="btn-nav-vip-terminal"
            type="button"
            onClick={() => {
              soundEngine.playClick(1200);
              onAcquireClick();
            }}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-[#FF2A00] hover:bg-[#e02600] text-black font-tech font-bold text-xs uppercase tracking-wider rounded transition-transform active:scale-95 shadow-[0_0_15px_rgba(255,42,0,0.25)]"
          >
            <Terminal className="w-3.5 h-3.5 text-black" />
            <span>VIP TERMINAL</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(900);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 text-[#a1a1aa] hover:text-white border border-[#27272a] rounded bg-[#121214]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-black border-b border-[#18181b] space-y-3">
          <div className="px-2 py-1 text-[11px] font-tech text-[#71717a]">
            {currentTime} // ACTIVE FEED
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              className="block w-full text-left px-3 py-2 text-sm font-tech text-[#a1a1aa] hover:text-[#FF2A00] hover:bg-[#121214] rounded transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onAcquireClick();
            }}
            className="w-full mt-2 py-2.5 bg-[#FF2A00] text-black font-tech font-bold text-xs uppercase tracking-wider rounded text-center"
          >
            OPEN VIP ACQUISITION TERMINAL
          </button>
        </div>
      )}
    </header>
  );
};
