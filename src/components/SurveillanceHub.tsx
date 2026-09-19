import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SurveillanceCam } from '../types';
import { SURVEILLANCE_CAMS } from '../data/inventory';
import { soundEngine } from '../utils/audio';
import { Camera, Radio, ZoomIn, ZoomOut, Maximize2, ShieldAlert, Wifi, Activity, Move } from 'lucide-react';

export const SurveillanceHub: React.FC = () => {
  const [selectedCam, setSelectedCam] = useState<SurveillanceCam>(SURVEILLANCE_CAMS[0]);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [isNightVision, setIsNightVision] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [liveTimestamp, setLiveTimestamp] = useState<string>('');
  const [viewMode, setViewMode] = useState<'single' | 'quad'>('single');
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      const millis = String(Math.floor(now.getUTCMilliseconds() / 10)).padStart(2, '0');
      setLiveTimestamp(`${dateStr} ${hours}:${mins}:${secs}.${millis}Z`);
    };
    const timer = setInterval(updateTime, 50);
    return () => clearInterval(timer);
  }, []);

  const handleSelectCamera = (cam: SurveillanceCam) => {
    soundEngine.playGlitch();
    setIsGlitching(true);
    setSelectedCam(cam);
    setPanOffset({ x: 0, y: 0 });
    setTimeout(() => {
      setIsGlitching(false);
    }, 280);
  };

  return (
    <section id="surveillance-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-black border-b border-[#18181b] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#18181b] pb-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 mb-2 bg-[#FF2A00]/10 border border-[#FF2A00]/30 text-[#FF2A00] text-[11px] font-tech uppercase tracking-widest">
              <Radio className="w-3 h-3 text-[#FF2A00] animate-pulse" />
              <span>DIGITAL SURVEILLANCE // ATELIER FEED MATRIX</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight text-white">
              CCTV RECONNAISSANCE <span className="text-[#FF2A00]">HUB</span>
            </h2>
            <p className="mt-1 text-sm font-body text-[#a1a1aa] max-w-xl">
              24/7 uncompressed encrypted surveillance over the subterranean vault, staging bays, and private drift testing circuit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                soundEngine.playClick(1000);
                setViewMode(viewMode === 'single' ? 'quad' : 'single');
              }}
              className="px-3 py-1.5 bg-[#121214] hover:bg-[#18181b] border border-[#27272a] hover:border-[#FF2A00] text-xs font-tech text-[#a1a1aa] hover:text-white rounded transition-colors"
            >
              MODE: {viewMode === 'single' ? 'QUAD MATRIX' : 'PRIMARY FOCUS'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                soundEngine.playClick(1200);
                setIsNightVision(!isNightVision);
              }}
              className={`px-3 py-1.5 border rounded text-xs font-tech font-bold transition-colors ${
                isNightVision 
                  ? 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/40' 
                  : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a]'
              }`}
            >
              IR NIGHT-VISION: {isNightVision ? 'ON' : 'OFF'}
            </motion.button>
          </div>
        </motion.div>

        {/* Main Feed Display */}
        {viewMode === 'single' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Primary Monitor (3 cols on large) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-3 relative bg-[#09090b] border border-[#27272a] rounded overflow-hidden shadow-2xl"
            >
              {/* Top Surveillance HUD */}
              <div className="absolute top-0 left-0 right-0 z-20 px-4 py-2 bg-black/80 backdrop-blur-sm border-b border-[#27272a] flex items-center justify-between font-tech text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[#FF2A00] font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF2A00] animate-rec" />
                    <span>REC</span>
                  </div>
                  <span className="text-white font-bold tracking-wider">{selectedCam.code}</span>
                  <span className="text-[#71717a] hidden sm:inline">| {selectedCam.location}</span>
                </div>

                <div className="flex items-center gap-4 text-[#a1a1aa]">
                  <span className="hidden md:inline text-[11px]">{selectedCam.focalLength}</span>
                  <span className="text-[#00FF66] font-bold">{selectedCam.fps} FPS</span>
                  <span>{liveTimestamp}</span>
                </div>
              </div>

              {/* Feed Image Container with Glitch & Scanline Effects */}
              <div className="relative w-full aspect-video sm:min-h-[460px] overflow-hidden flex items-center justify-center bg-black">
                <motion.img
                  animate={{
                    x: isGlitching ? [-15, 15, -8, 8, 0] : panOffset.x,
                    y: isGlitching ? [5, -5, 3, -3, 0] : panOffset.y,
                    scale: isGlitching ? zoomLevel * 1.05 : zoomLevel
                  }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  src={selectedCam.image}
                  alt={selectedCam.name}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isNightVision 
                      ? 'filter grayscale contrast-150 brightness-90' 
                      : 'filter contrast-125 brightness-95'
                  } ${isGlitching ? 'opacity-50' : 'opacity-100'}`}
                />

                {/* Scanlines and CRT Grime */}
                <div className="absolute inset-0 scanlines opacity-80 pointer-events-none" />
                <div className="absolute inset-0 noise-overlay opacity-50 pointer-events-none" />

                {/* Night vision green tint layer if enabled */}
                {isNightVision && (
                  <div className="absolute inset-0 bg-emerald-950/25 mix-blend-color pointer-events-none" />
                )}

                {/* Tactical HUD Crosshair Overlays with rotation */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: [0, 90, 180, 270, 360] }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="relative w-36 h-36 border border-dashed border-[#FF2A00]/40 rounded-full flex items-center justify-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#FF2A00]" />
                    <div className="absolute top-0 bottom-0 w-px bg-[#FF2A00]/30" />
                    <div className="absolute left-0 right-0 h-px bg-[#FF2A00]/30" />
                  </motion.div>
                </div>

                {/* Optical Corner Brackets */}
                <div className="absolute top-12 left-6 w-8 h-8 border-t-2 border-l-2 border-white/60 pointer-events-none" />
                <div className="absolute top-12 right-6 w-8 h-8 border-t-2 border-r-2 border-white/60 pointer-events-none" />
                <div className="absolute bottom-12 left-6 w-8 h-8 border-b-2 border-l-2 border-white/60 pointer-events-none" />
                <div className="absolute bottom-12 right-6 w-8 h-8 border-b-2 border-r-2 border-white/60 pointer-events-none" />

                {/* Live Bitrate & Telemetry Tag */}
                <div className="absolute bottom-4 left-4 z-20 font-tech text-xs bg-black/80 px-3 py-1.5 border border-[#27272a] rounded text-[#a1a1aa] flex items-center gap-3 backdrop-blur-sm">
                  <span className="text-[#00FF66] font-bold">ENC: {selectedCam.bitrate}</span>
                  <span className="hidden sm:inline">BANDWIDTH: 1.2 GB/s</span>
                  <span className="text-white">STATUS: {selectedCam.status}</span>
                </div>

                {/* Zoom & Pan Controls Overlay */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
                  {/* Pan Quick Controls */}
                  <div className="hidden sm:flex items-center gap-1 bg-black/80 p-1 border border-[#27272a] rounded">
                    <button
                      type="button"
                      onClick={() => setPanOffset(prev => ({ ...prev, x: prev.x + 20 }))}
                      className="px-1.5 py-0.5 font-tech text-[10px] text-[#a1a1aa] hover:text-white hover:bg-[#18181b] rounded"
                      title="Pan Left"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={() => setPanOffset({ x: 0, y: 0 })}
                      className="px-1.5 py-0.5 font-tech text-[10px] text-[#FF2A00] hover:bg-[#18181b] rounded"
                      title="Center Pan"
                    >
                      CTR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPanOffset(prev => ({ ...prev, x: prev.x - 20 }))}
                      className="px-1.5 py-0.5 font-tech text-[10px] text-[#a1a1aa] hover:text-white hover:bg-[#18181b] rounded"
                      title="Pan Right"
                    >
                      ▶
                    </button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 bg-black/80 p-1 border border-[#27272a] rounded backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick(1050);
                        setZoomLevel(prev => Math.max(1, prev - 0.25));
                      }}
                      className="p-1 hover:bg-[#18181b] text-[#a1a1aa] hover:text-white rounded"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="px-2 font-tech text-xs text-white">{zoomLevel.toFixed(1)}x</span>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick(1150);
                        setZoomLevel(prev => Math.min(2.5, prev + 0.25));
                      }}
                      className="p-1 hover:bg-[#18181b] text-[#a1a1aa] hover:text-white rounded"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Camera Channel Selector Sidebar */}
            <div className="flex flex-col gap-3">
              <div className="text-xs font-tech text-[#71717a] uppercase tracking-wider px-1">
                CONNECTED CAM NODES (4 ACTIVE)
              </div>

              {SURVEILLANCE_CAMS.map((cam) => {
                const isCurrent = cam.id === selectedCam.id;
                return (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={cam.id}
                    onClick={() => handleSelectCamera(cam)}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-[#18181b] border-[#FF2A00] shadow-[0_0_15px_rgba(255,42,0,0.3)]'
                        : 'bg-[#09090b] border-[#18181b] hover:border-[#27272a]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-tech mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-[#FF2A00] animate-pulse' : 'bg-[#71717a]'}`} />
                        <span className="font-bold text-white">{cam.code}</span>
                      </div>
                      <span className="text-[#00FF66] text-[10px]">{cam.fps} FPS</span>
                    </div>

                    <div className="text-xs text-[#a1a1aa] font-body truncate">
                      {cam.location}
                    </div>

                    <div className="mt-2 text-[10px] font-tech text-[#71717a] flex items-center justify-between pt-1 border-t border-[#18181b]">
                      <span>{cam.focalLength}</span>
                      <span className="text-[#FF2A00]">{cam.status}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Quad Matrix View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SURVEILLANCE_CAMS.map((cam) => (
              <motion.div
                whileHover={{ scale: 1.01 }}
                key={cam.id}
                onClick={() => {
                  setSelectedCam(cam);
                  setViewMode('single');
                }}
                className="relative bg-[#09090b] border border-[#27272a] rounded overflow-hidden cursor-pointer group"
              >
                <div className="aspect-video w-full relative">
                  <img
                    src={cam.image}
                    alt={cam.name}
                    className="w-full h-full object-cover filter contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 scanlines opacity-70 pointer-events-none" />
                  
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-white font-tech text-xs rounded border border-[#27272a]">
                    {cam.code} // {cam.location}
                  </div>

                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#FF2A00] text-black font-tech text-[10px] font-bold rounded">
                    CLICK TO FOCUS
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
