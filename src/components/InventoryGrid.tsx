import React, { useState, useMemo, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Vehicle } from '../types';
import { VEHICLES } from '../data/inventory';
import { soundEngine } from '../utils/audio';
import { 
  Search, 
  Filter, 
  Gauge, 
  Zap, 
  ShieldCheck, 
  Volume2, 
  ArrowUpRight, 
  Compass, 
  Flame 
} from 'lucide-react';

interface InventoryGridProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onAcquireVehicle: (vehicle: Vehicle) => void;
}

// Interactive 3D Tilt Card with dynamic glare and laser scan
const VehicleTiltCard: React.FC<{
  vehicle: Vehicle;
  index: number;
  playingAudioId: string | null;
  onSelect: () => void;
  onAcquire: () => void;
  onPreviewAudio: (e: React.MouseEvent) => void;
}> = ({ vehicle, index, playingAudioId, onSelect, onAcquire, onPreviewAudio }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);
  const glareOpacity = useTransform(mouseXSpring, [-0.5, 0, 0.5], [0.3, 0, 0.3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isAudioPlaying = playingAudioId === vehicle.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
      style={{ perspective: 1000 }}
      className="w-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onSelect}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        whileHover={{ scale: 1.02 }}
        className={`group relative bg-[#09090b] border transition-colors duration-300 rounded overflow-hidden flex flex-col justify-between cursor-pointer ${
          isAudioPlaying 
            ? 'border-[#FF2A00] shadow-[0_0_30px_rgba(255,42,0,0.4)]' 
            : 'border-[#18181b] hover:border-[#FF2A00]/80 shadow-xl'
        }`}
      >
        {/* Dynamic Light Sheen Glare */}
        <motion.div
          style={{ opacity: glareOpacity }}
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none z-30"
        />

        {/* Top glowing laser line on active card */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF2A00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30" />

        {/* Image Container */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-black">
          <img
            src={vehicle.images.main}
            alt={vehicle.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 filter contrast-110 brightness-95"
            loading="lazy"
          />

          {/* Holographic scan line on hover */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF2A00]/15 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none" />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/60 pointer-events-none" />

          {/* Top status badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            <span className="px-2 py-0.5 bg-black/80 border border-[#27272a] text-[#FF2A00] font-tech text-[10px] font-bold rounded backdrop-blur-sm shadow-md">
              {vehicle.badge}
            </span>

            <span className="px-2 py-0.5 bg-[#121214]/80 border border-[#27272a] text-[#a1a1aa] font-tech text-[10px] rounded backdrop-blur-sm">
              {vehicle.locationStatus}
            </span>
          </div>

          {/* Sound preview button in corner */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onPreviewAudio}
            className={`absolute bottom-3 right-3 z-20 p-2 rounded-full border transition-all ${
              isAudioPlaying
                ? 'bg-[#FF2A00] text-black border-[#FF2A00] animate-pulse shadow-[0_0_15px_#FF2A00]'
                : 'bg-black/80 hover:bg-[#FF2A00] hover:text-black text-white border-[#27272a]'
            }`}
            title="Audition Exhaust Symphony"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Card Details */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-tech text-[#71717a] mb-1">
              <span>{vehicle.year} // {vehicle.make.toUpperCase()}</span>
              <span>{vehicle.specs.drivetrain}</span>
            </div>

            <h3 className="font-display font-bold text-xl text-white group-hover:text-[#FF2A00] transition-colors leading-tight">
              {vehicle.name}
            </h3>

            <p className="mt-1 text-xs font-body text-[#a1a1aa] line-clamp-2">
              {vehicle.tagline}
            </p>
          </div>

          {/* Specs Strip */}
          <div className="my-4 grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#121214] border border-[#18181b] rounded font-tech text-center">
            <div>
              <div className="text-[10px] text-[#71717a]">OUTPUT</div>
              <div className="text-xs text-white font-bold">{vehicle.specs.powerHp} HP</div>
            </div>
            <div>
              <div className="text-[10px] text-[#71717a]">0-60 MPH</div>
              <div className="text-xs text-[#FF2A00] font-bold">{vehicle.specs.zeroToSixtySec}s</div>
            </div>
            <div>
              <div className="text-[10px] text-[#71717a]">TOP SPEED</div>
              <div className="text-xs text-white font-bold">{vehicle.specs.topSpeedMph} MPH</div>
            </div>
          </div>

          {/* Price & Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-[#18181b]">
            <div>
              <div className="text-[10px] font-tech text-[#71717a]">ACQUISITION VALUE</div>
              <div className="text-lg font-display font-bold text-white tracking-wide">
                ${vehicle.price.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playClick(1150);
                  onAcquire();
                }}
                className="px-3 py-1.5 bg-[#FF2A00] hover:bg-[#e02600] text-black font-tech font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-[0_0_10px_rgba(255,42,0,0.3)]"
              >
                ACQUIRE
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, borderColor: '#FF2A00' }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => {
                  soundEngine.playClick(1050);
                  onSelect();
                }}
                className="p-1.5 bg-[#121214] hover:bg-[#18181b] text-white border border-[#27272a] rounded transition-colors"
                title="Inspect Blueprint Schematic"
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const InventoryGrid: React.FC<InventoryGridProps> = ({ onSelectVehicle, onAcquireVehicle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'power-desc'>('price-desc');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'ALL SPECIMENS' },
    { id: 'hypercar', label: 'HYPERCARS' },
    { id: 'gt-track', label: 'GT TRACK WEAPONS' },
    { id: 'jdm-legend', label: 'JDM LEGENDS' },
    { id: 'street-drift', label: 'STREET DRIFT' }
  ];

  const filteredVehicles = useMemo(() => {
    return VEHICLES.filter((v) => {
      const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
      const matchesSearch = 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.specs.engine.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'power-desc') return b.specs.powerHp - a.specs.powerHp;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handlePreviewAudio = (vehicle: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playClick(1200);
    setPlayingAudioId(vehicle.id);
    soundEngine.revEngine(vehicle.specs.redlineRpm - 200);
    setTimeout(() => {
      setPlayingAudioId(null);
    }, 1200);
  };

  return (
    <section id="inventory-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-black border-b border-[#18181b] relative overflow-hidden">
      {/* Background ambient dither */}
      <div className="absolute inset-0 dither-grid opacity-20 pointer-events-none" />

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
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A00] animate-ping" />
              <span>ACTIVE SPEC CATALOG // NOCTURNE INVENTORY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight text-white">
              EXCLUSIVE <span className="text-[#FF2A00]">VAULT SPECIMENS</span>
            </h2>
            <p className="mt-1 text-sm font-body text-[#a1a1aa] max-w-xl">
              Precision-tuned hypercars, homologation specials, and high-angle drift machines inspected to forensic standards.
            </p>
          </div>

          <div className="text-right font-tech text-xs text-[#71717a]">
            <span>VAULT STATUS: </span>
            <span className="text-[#00FF66] font-bold animate-pulse">READY FOR DEPLOYMENT</span>
            <div className="text-white font-bold text-sm mt-0.5">
              {filteredVehicles.length} UNITS AVAILABLE
            </div>
          </div>
        </motion.div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs with Animated Pill */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none relative">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(1000);
                    setSelectedCategory(cat.id);
                  }}
                  className={`relative px-3.5 py-1.5 rounded text-xs font-tech tracking-wider uppercase transition-colors whitespace-nowrap ${
                    isActive ? 'text-black font-bold' : 'text-[#a1a1aa] hover:text-white bg-[#121214] border border-[#27272a]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterTab"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      className="absolute inset-0 bg-[#FF2A00] rounded shadow-[0_0_12px_rgba(255,42,0,0.5)] z-0"
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
              <input
                type="text"
                placeholder="SEARCH MAKE, MODEL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#121214] border border-[#27272a] rounded text-xs font-tech text-white placeholder-[#71717a] focus:border-[#FF2A00] focus:outline-none focus:ring-1 focus:ring-[#FF2A00]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => {
                soundEngine.playClick(950);
                setSortBy(e.target.value as any);
              }}
              className="px-3 py-1.5 bg-[#121214] border border-[#27272a] rounded text-xs font-tech text-[#a1a1aa] focus:border-[#FF2A00] focus:outline-none"
            >
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="power-desc">POWER: HIGHEST BHP</option>
            </select>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <VehicleTiltCard
              key={vehicle.id}
              vehicle={vehicle}
              index={index}
              playingAudioId={playingAudioId}
              onSelect={() => {
                soundEngine.playClick(1100);
                onSelectVehicle(vehicle);
              }}
              onAcquire={() => {
                onAcquireVehicle(vehicle);
              }}
              onPreviewAudio={(e) => handlePreviewAudio(vehicle, e)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
