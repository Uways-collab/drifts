import React from 'react';
import { soundEngine } from '../utils/audio';
import { Shield, Radio, Terminal, ArrowUp, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundEngine.playClick(1100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-black border-t border-[#18181b] text-[#71717a] font-tech text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Agency Branding & Location Ticker */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#18181b]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-[#FF2A00] flex items-center justify-center font-display font-bold text-black text-sm">
                E
              </div>
              <span className="font-display font-bold text-white text-lg tracking-wider">
                EMPATHON <span className="text-[#FF2A00]">AUTOS</span>
              </span>
            </div>
            <p className="font-body text-xs text-[#a1a1aa] max-w-md">
              Nocturnal hyper-atelier and acquisition bunker. Dedicated to extreme street drift dynamics, uncompromised GT track engineering, and forensic collector provenance.
            </p>
          </div>

          <div className="space-y-1 text-right text-xs">
            <div className="flex items-center justify-end gap-2 text-white">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
              <span className="font-bold">ALL ATELIER NODES ONLINE</span>
            </div>
            <div>TOKYO BUNKER: 35.6762° N, 139.6503° E</div>
            <div>NÜRBURGRING PADDOCK: 50.3356° N, 6.9475° E</div>
          </div>
        </div>

        {/* Middle Metadata & Cryptographic Certification */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[11px]">
          <div>
            <span className="text-white font-bold block mb-1 uppercase tracking-wider">
              ENCRYPTED ESCROW PROTOCOL
            </span>
            <p className="text-[#71717a] leading-relaxed">
              Every acquisition is bonded through institutional multi-sig escrow with hardware telemetry verification before physical release.
            </p>
          </div>

          <div>
            <span className="text-white font-bold block mb-1 uppercase tracking-wider">
              PRIVATE CIRCUIT PRIVILEGES
            </span>
            <p className="text-[#71717a] leading-relaxed">
              Acquisition includes 12 months unlimited nocturnal access to the Sector 7 drift circuit with dedicated tire management and pit crew.
            </p>
          </div>

          <div>
            <span className="text-white font-bold block mb-1 uppercase tracking-wider">
              SURVEILLANCE &amp; TELEMETRY
            </span>
            <p className="text-[#71717a] leading-relaxed">
              Continuous 4K CCTV optical feed with dynamic IMU slip angle tracking and engine telemetry logged directly to secure vault ledger.
            </p>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#18181b] text-[#52525b]">
          <div>
            © {new Date().getFullYear()} EMPATHON AUTOS INC. ALL RIGHTS RESERVED. NOCTURNE ATELIER EDITION.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121214] hover:bg-[#18181b] text-[#a1a1aa] hover:text-[#FF2A00] border border-[#27272a] rounded transition-colors"
          >
            <span>RETURN TO APEX</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
