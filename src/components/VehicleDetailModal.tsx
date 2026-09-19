import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Vehicle } from '../types';
import { soundEngine } from '../utils/audio';
import { 
  X, 
  Volume2, 
  Flame, 
  ShieldCheck, 
  Gauge, 
  Activity, 
  Cpu, 
  Compass, 
  Layers, 
  SlidersHorizontal, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onAcquire: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehicle, onClose, onAcquire }) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'drift-setup' | 'dyno' | 'gallery'>('blueprint');
  const [activeImageKey, setActiveImageKey] = useState<'main' | 'side' | 'cockpit' | 'engine'>('main');
  const [isRevving, setIsRevving] = useState<boolean>(false);

  if (!vehicle) return null;

  const handleRevSound = () => {
    soundEngine.playClick(1100);
    setIsRevving(true);
    soundEngine.revEngine(vehicle.specs.redlineRpm - 200);
    setTimeout(() => {
      setIsRevving(false);
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.93, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 25 }}
        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        className="relative w-full max-w-5xl bg-[#09090b] border border-[#27272a] rounded shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#18181b] bg-black/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF2A00]" />
            <div>
              <span className="font-tech text-xs text-[#71717a] tracking-wider block">
                SCHEMATIC DOSSIER // {vehicle.chassisCode}
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-wide leading-none">
                {vehicle.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRevSound}
              disabled={isRevving}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-tech font-bold transition-all ${
                isRevving 
                  ? 'bg-[#FF2A00] text-black border-[#FF2A00] shadow-[0_0_15px_#FF2A00]' 
                  : 'bg-[#121214] text-[#FF2A00] border-[#FF2A00]/50 hover:bg-[#FF2A00] hover:text-black'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isRevving ? 'EXHAUST ROAR...' : 'AUDITION ENGINE'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(900);
                onClose();
              }}
              className="p-1.5 text-[#a1a1aa] hover:text-white border border-[#27272a] rounded bg-[#121214]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#18181b] bg-[#0c0c0e] flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
          {[
            { id: 'blueprint', label: 'TECHNICAL BLUEPRINT', icon: FileText },
            { id: 'drift-setup', label: 'DRIFT & CHASSIS DYNAMICS', icon: SlidersHorizontal },
            { id: 'dyno', label: 'DYNO POWER CURVE', icon: Activity },
            { id: 'gallery', label: 'OPTICAL DOSSIER', icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick(1050);
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-tech tracking-wider uppercase transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#FF2A00] text-black font-bold' 
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Main Hero Photo / Gallery Switcher */}
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full bg-black rounded overflow-hidden border border-[#18181b]">
            <img
              src={vehicle.images[activeImageKey]}
              alt={vehicle.name}
              className="w-full h-full object-cover filter contrast-110 brightness-95"
            />
            <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

            {/* Thumbnail switcher buttons */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/80 p-1.5 rounded border border-[#27272a] backdrop-blur-md">
              {(['main', 'side', 'cockpit', 'engine'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(1000);
                    setActiveImageKey(key);
                  }}
                  className={`px-2 py-1 text-[10px] font-tech uppercase rounded transition-colors ${
                    activeImageKey === key 
                      ? 'bg-[#FF2A00] text-black font-bold' 
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Price Tag Overlay */}
            <div className="absolute top-3 right-3 px-3 py-1 bg-black/80 border border-[#27272a] rounded backdrop-blur-md text-right">
              <span className="text-[10px] font-tech text-[#71717a] block">ASKING ACQUISITION</span>
              <span className="font-display font-bold text-lg text-white">
                ${vehicle.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* TAB 1: TECHNICAL BLUEPRINT */}
          {activeTab === 'blueprint' && (
            <div className="space-y-6">
              <div className="bg-[#121214] p-4 rounded border border-[#18181b]">
                <h4 className="font-tech text-xs text-[#FF2A00] uppercase tracking-wider mb-2">
                  CHASSIS SUMMARY // {vehicle.tagline}
                </h4>
                <p className="font-body text-sm text-[#d4d4d8] leading-relaxed">
                  {vehicle.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-tech">
                <div className="p-3 bg-[#121214] border border-[#18181b] rounded">
                  <div className="text-[10px] text-[#71717a]">POWER OUTPUT</div>
                  <div className="text-base text-white font-bold">{vehicle.specs.powerHp} BHP</div>
                  <div className="text-[10px] text-[#FF2A00]">@ {vehicle.specs.redlineRpm - 500} RPM</div>
                </div>

                <div className="p-3 bg-[#121214] border border-[#18181b] rounded">
                  <div className="text-[10px] text-[#71717a]">TORQUE</div>
                  <div className="text-base text-white font-bold">{vehicle.specs.torqueNm} NM</div>
                  <div className="text-[10px] text-[#a1a1aa]">Peak curve plateau</div>
                </div>

                <div className="p-3 bg-[#121214] border border-[#18181b] rounded">
                  <div className="text-[10px] text-[#71717a]">0-60 MPH SPRINT</div>
                  <div className="text-base text-[#FF2A00] font-bold">{vehicle.specs.zeroToSixtySec} SEC</div>
                  <div className="text-[10px] text-[#a1a1aa]">Telemetry launch</div>
                </div>

                <div className="p-3 bg-[#121214] border border-[#18181b] rounded">
                  <div className="text-[10px] text-[#71717a]">TOP VELOCITY</div>
                  <div className="text-base text-white font-bold">{vehicle.specs.topSpeedMph} MPH</div>
                  <div className="text-[10px] text-[#a1a1aa]">Aerodynamic drag limited</div>
                </div>

                <div className="p-3 bg-[#121214] border border-[#18181b] rounded">
                  <div className="text-[10px] text-[#71717a]">ENGINE ARCHITECTURE</div>
                  <div className="text-xs text-white font-bold truncate">{vehicle.specs.engine}</div>
                  <div className="text-[10px] text-[#a1a1aa]">{vehicle.specs.displacement}</div>
                </div>

                <div className="p-3 bg-[#121214] border border-[#18181b] rounded">
                  <div className="text-[10px] text-[#71717a]">TRANSMISSION</div>
                  <div className="text-xs text-white font-bold truncate">{vehicle.specs.transmission}</div>
                  <div className="text-[10px] text-[#a1a1aa]">Close-ratio gearset</div>
                </div>

                <div className="p-3 bg-[#121214] border border-[#18181b] rounded">
                  <div className="text-[10px] text-[#71717a]">CURB WEIGHT</div>
                  <div className="text-base text-white font-bold">{vehicle.specs.weightKg} KG</div>
                  <div className="text-[10px] text-[#a1a1aa]">Dry competition spec</div>
                </div>

                <div className="p-3 bg-[#121214] border border-[#18181b] rounded">
                  <div className="text-[10px] text-[#71717a]">REDLINE LIMITER</div>
                  <div className="text-base text-[#FF2A00] font-bold">{vehicle.specs.redlineRpm} RPM</div>
                  <div className="text-[10px] text-[#a1a1aa]">Titanium valvetrain</div>
                </div>
              </div>

              {/* Cryptographic Verification Badge */}
              <div className="p-4 bg-[#121214] border border-[#18181b] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-tech text-xs">
                <div>
                  <span className="text-[#71717a]">AUTHENTICATED VIN: </span>
                  <span className="text-white font-bold">{vehicle.vinNumber}</span>
                  <div className="text-[11px] text-[#00FF66] flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED ATELIER CHAIN OF CUSTODY • TITLED &amp; READY</span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-[#71717a]">
                  STORED AT: <span className="text-white">{vehicle.locationStatus}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DRIFT & CHASSIS DYNAMICS */}
          {activeTab === 'drift-setup' && (
            <div className="space-y-6 font-tech">
              <div className="p-4 bg-[#121214] border border-[#18181b] rounded">
                <h4 className="text-xs text-[#FF2A00] uppercase tracking-wider mb-1">
                  TACTICAL DRIFT &amp; STEERING GEOMETRY CALIBRATION
                </h4>
                <p className="text-xs text-[#a1a1aa]">
                  Calibrated for violent, high-speed backward entries, sustained high-angle lateral drifts, and instant apex transitions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#121214] border border-[#18181b] rounded space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#71717a]">STEERING LOCK ANGLE</span>
                    <span className="text-sm font-bold text-[#FF2A00]">{vehicle.driftSetup.steeringLockAngle}° MAXIMUM</span>
                  </div>
                  <div className="w-full h-2 bg-[#18181b] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF2A00]" 
                      style={{ width: `${(vehicle.driftSetup.steeringLockAngle / 75) * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-[#71717a]">
                    High-clearance knuckles with zero Ackerman geometry for maximum slip stabilization.
                  </div>
                </div>

                <div className="p-4 bg-[#121214] border border-[#18181b] rounded space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#71717a]">2-WAY LSD LOCK RATIO</span>
                    <span className="text-sm font-bold text-white">{vehicle.driftSetup.lsdLockPct}% BINDING</span>
                  </div>
                  <div className="w-full h-2 bg-[#18181b] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white" 
                      style={{ width: `${vehicle.driftSetup.lsdLockPct}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-[#71717a]">
                    Aggressive plate lockup under deceleration initiates reliable slip angle upon turn-in.
                  </div>
                </div>

                <div className="p-4 bg-[#121214] border border-[#18181b] rounded space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#71717a]">AERODYNAMIC DOWNFORCE</span>
                    <span className="text-sm font-bold text-white">{vehicle.driftSetup.downforceKgAt200} KG @ 200 KM/H</span>
                  </div>
                  <div className="w-full h-2 bg-[#18181b] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00FF66]" 
                      style={{ width: `${(vehicle.driftSetup.downforceKgAt200 / 800) * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-[#71717a]">
                    Carbon GT wing &amp; rear diffuser channels ground effect to stabilize high-speed sweepers.
                  </div>
                </div>

                <div className="p-4 bg-[#121214] border border-[#18181b] rounded space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#71717a]">BOOST PRESSURE</span>
                    <span className="text-sm font-bold text-[#FF2A00]">
                      {vehicle.driftSetup.boostPressureBar > 0 ? `${vehicle.driftSetup.boostPressureBar} BAR` : 'N/A (NATURALLY ASPIRATED)'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#18181b] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF2A00]" 
                      style={{ width: `${(vehicle.driftSetup.boostPressureBar / 2.5) * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-[#71717a]">
                    Electronic wastegate mapped with antilag rotational idle mode.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#121214] border border-[#18181b] rounded">
                  <div className="text-[10px] text-[#71717a]">TIRE SPECIFICATION</div>
                  <div className="text-xs text-white font-bold mt-0.5">{vehicle.driftSetup.tireCompound}</div>
                </div>
                <div className="p-3 bg-[#121214] border border-[#18181b] rounded">
                  <div className="text-[10px] text-[#71717a]">FRONT / REAR CAMBER</div>
                  <div className="text-xs text-white font-bold mt-0.5">
                    {vehicle.driftSetup.camberFront} / {vehicle.driftSetup.camberRear}
                  </div>
                </div>
                <div className="p-3 bg-[#121214] border border-[#18181b] rounded">
                  <div className="text-[10px] text-[#71717a]">WEIGHT DISTRIBUTION</div>
                  <div className="text-xs text-white font-bold mt-0.5">{vehicle.driftSetup.weightDistribution}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DYNO POWER CURVE */}
          {activeTab === 'dyno' && (
            <div className="space-y-6 font-tech">
              <div className="p-4 bg-[#121214] border border-[#18181b] rounded flex items-center justify-between">
                <div>
                  <h4 className="text-xs text-[#FF2A00] uppercase tracking-wider mb-1">
                    CHASSIS DYNAMOMETER TELEMETRY
                  </h4>
                  <p className="text-xs text-[#a1a1aa]">
                    Acoustic dyno cell twin-roller run under ambient 18°C temperature and 1,013 mbar atmospheric pressure.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#71717a] block">PEAK OUTPUT</span>
                  <span className="text-lg font-bold text-white">{vehicle.specs.powerHp} HP / {vehicle.specs.torqueNm} NM</span>
                </div>
              </div>

              {/* Dyno Curve SVG Graph */}
              <div className="w-full bg-[#121214] p-4 rounded border border-[#18181b]">
                <div className="flex items-center justify-between text-xs mb-3 text-[#71717a]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-[#FF2A00]">
                      <span className="w-3 h-0.5 bg-[#FF2A00]" /> HORSEPOWER (HP)
                    </span>
                    <span className="flex items-center gap-1 text-[#00FF66]">
                      <span className="w-3 h-0.5 bg-[#00FF66]" /> TORQUE (NM)
                    </span>
                  </div>
                  <span>TEST CELL: RUN_#042</span>
                </div>

                <div className="relative w-full h-56 flex items-end">
                  {/* Dyno Bars & Line Simulation */}
                  <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[40, 80, 120, 160].map((y) => (
                      <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#27272a" strokeDasharray="3 3" />
                    ))}

                    {/* Torque curve (Green) */}
                    <path
                      d={vehicle.dynoCurve.reduce((acc, pt, idx) => {
                        const x = (idx / (vehicle.dynoCurve.length - 1)) * 580 + 10;
                        const y = 190 - (pt.torque / (vehicle.specs.torqueNm * 1.15)) * 170;
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#00FF66"
                      strokeWidth="2.5"
                    />

                    {/* Horsepower curve (Neon Red) */}
                    <path
                      d={vehicle.dynoCurve.reduce((acc, pt, idx) => {
                        const x = (idx / (vehicle.dynoCurve.length - 1)) * 580 + 10;
                        const y = 190 - (pt.hp / (vehicle.specs.powerHp * 1.15)) * 170;
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#FF2A00"
                      strokeWidth="3"
                    />

                    {/* Points */}
                    {vehicle.dynoCurve.map((pt, idx) => {
                      const x = (idx / (vehicle.dynoCurve.length - 1)) * 580 + 10;
                      const yHp = 190 - (pt.hp / (vehicle.specs.powerHp * 1.15)) * 170;
                      return (
                        <circle key={idx} cx={x} cy={yHp} r="4" fill="#FF2A00" />
                      );
                    })}
                  </svg>
                </div>

                {/* X-Axis RPM Labels */}
                <div className="flex justify-between text-[11px] text-[#71717a] pt-2 border-t border-[#18181b]">
                  {vehicle.dynoCurve.map((pt) => (
                    <span key={pt.rpm}>{pt.rpm} RPM</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OPTICAL DOSSIER GALLERY */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(vehicle.images).map(([angle, url]) => (
                <div 
                  key={angle}
                  onClick={() => setActiveImageKey(angle as any)}
                  className="group relative aspect-16/10 rounded overflow-hidden border border-[#27272a] hover:border-[#FF2A00] cursor-pointer"
                >
                  <img src={url} alt={angle} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 font-tech text-[10px] text-white uppercase rounded">
                    PERSPECTIVE: {angle}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-[#18181b] bg-black/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-tech text-xs text-[#71717a] text-center sm:text-left">
            <span>READY FOR PRIVATE INSPECTION OR ESCROW ALLOCATION</span>
            <div className="text-white font-bold">
              ESTIMATED WIRE CLEARANCE: 12-24 HOURS
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(900);
                onClose();
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#121214] hover:bg-[#18181b] border border-[#27272a] text-xs font-tech text-[#a1a1aa] hover:text-white rounded"
            >
              CLOSE SCHEMATIC
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(1200);
                onClose();
                onAcquire(vehicle);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#FF2A00] hover:bg-[#e02600] text-black font-tech font-bold text-xs uppercase tracking-wider rounded transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,42,0,0.3)]"
            >
              PROCEED TO ACQUISITION ESCROW
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
