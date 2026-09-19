import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../utils/audio';
import { Activity, Compass, Gauge, Zap, Flame, RotateCcw } from 'lucide-react';

export const TelemetryHud: React.FC = () => {
  const [slipAngle, setSlipAngle] = useState<number>(34.2);
  const [lateralG, setLateralG] = useState<number>(1.38);
  const [speedMph, setSpeedMph] = useState<number>(84);
  const [throttlePct, setThrottlePct] = useState<number>(76);
  const [boostBar, setBoostBar] = useState<number>(1.85);
  const [isDriftingTransition, setIsDriftingTransition] = useState<boolean>(false);

  // Dynamic drift fluctuation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setSlipAngle(prev => {
        const delta = (Math.random() - 0.48) * 1.5;
        return parseFloat(Math.min(58, Math.max(12, prev + delta)).toFixed(1));
      });
      setLateralG(prev => {
        const delta = (Math.random() - 0.48) * 0.08;
        return parseFloat(Math.min(1.85, Math.max(0.6, prev + delta)).toFixed(2));
      });
      setSpeedMph(prev => {
        const delta = (Math.random() - 0.48) * 2;
        return Math.round(Math.min(115, Math.max(65, prev + delta)));
      });
    }, 180);

    return () => clearInterval(timer);
  }, []);

  const handleSimulateTransition = () => {
    soundEngine.playClick(1300);
    soundEngine.revEngine(8600);
    setIsDriftingTransition(true);
    setSlipAngle(54.4);
    setLateralG(1.78);
    setThrottlePct(98);
    setBoostBar(2.3);

    setTimeout(() => {
      setSlipAngle(32.1);
      setLateralG(1.25);
      setThrottlePct(72);
      setBoostBar(1.8);
      setIsDriftingTransition(false);
    }, 1500);
  };

  return (
    <section id="telemetry-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-black border-b border-[#18181b] relative overflow-hidden">
      {/* Laser scanline in background */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FF2A00] to-transparent animate-speed-stream opacity-40 pointer-events-none" />

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
              <Activity className="w-3 h-3 text-[#FF2A00] animate-pulse" />
              <span>LIVE SENSOR BUS // CAN-FD 5.0 MBPS TELEMETRY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight text-white">
              DRIFT DYNAMICS <span className="text-[#FF2A00]">&amp; G-FORCE RADAR</span>
            </h2>
            <p className="mt-1 text-sm font-body text-[#a1a1aa] max-w-xl">
              Real-time inertial measurement unit (IMU) telemetry recording yaw rate, tire thermal degradation, and lateral slip velocity.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255, 42, 0, 0.5)' }}
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={handleSimulateTransition}
            className={`px-4 py-2 font-tech text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-2 ${
              isDriftingTransition
                ? 'bg-[#FF2A00] text-black border border-[#FF2A00] animate-pulse shadow-[0_0_20px_#FF2A00]'
                : 'bg-[#121214] text-[#FF2A00] border border-[#FF2A00]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>TRIGGER WEIGHT TRANSITION (FEINT DRIFT)</span>
          </motion.button>
        </motion.div>

        {/* Telemetry Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-tech">
          
          {/* Tile 1: Lateral G-Force Radar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            whileHover={{ borderColor: 'rgba(255, 42, 0, 0.6)' }}
            className="bg-[#09090b] p-5 rounded border border-[#18181b] flex flex-col justify-between relative overflow-hidden group shadow-lg"
          >
            <div className="flex items-center justify-between text-xs text-[#71717a] mb-2">
              <span>LATERAL G-RADAR</span>
              <span className="text-[#FF2A00] font-bold">2.0G SCALE</span>
            </div>

            {/* Radar Circle */}
            <div className="relative w-44 h-44 mx-auto my-3 border border-[#27272a] rounded-full flex items-center justify-center overflow-hidden">
              {/* Concentric rings */}
              <div className="w-32 h-32 border border-[#18181b] rounded-full" />
              <div className="w-20 h-20 border border-[#18181b] rounded-full" />
              <div className="w-8 h-8 border border-[#18181b] rounded-full" />
              
              {/* Axes */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-px bg-[#18181b]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-full w-px bg-[#18181b]" />
              </div>

              {/* Rotating Radar Scanner Sweep */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 origin-center pointer-events-none"
              >
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-[#FF2A00]/25 via-[#FF2A00]/5 to-transparent origin-bottom-right rounded-tl-full" />
              </motion.div>

              {/* Dynamic G-force point with smooth physics spring */}
              <motion.div 
                animate={{
                  x: lateralG * 36 - 15,
                  y: isDriftingTransition ? -25 : -15,
                  scale: isDriftingTransition ? 1.4 : 1
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className="absolute w-3.5 h-3.5 rounded-full bg-[#FF2A00] shadow-[0_0_12px_#FF2A00]"
              />
            </div>

            <div className="flex justify-between text-xs pt-2 border-t border-[#18181b]">
              <span className="text-[#71717a]">LATERAL LOAD:</span>
              <span className="text-white font-bold">{lateralG} G</span>
            </div>
          </motion.div>

          {/* Tile 2: Drift Slip Angle Gauge */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ borderColor: 'rgba(255, 42, 0, 0.6)' }}
            className="bg-[#09090b] p-5 rounded border border-[#18181b] flex flex-col justify-between shadow-lg"
          >
            <div className="flex items-center justify-between text-xs text-[#71717a] mb-2">
              <span>SLIP ANGLE (YAW)</span>
              <span className="text-[#00FF66] font-bold animate-pulse">STABLE LOCK</span>
            </div>

            <div className="my-auto text-center py-4">
              <motion.div 
                animate={{ scale: isDriftingTransition ? [1, 1.1, 1] : 1 }}
                className="font-display font-bold text-5xl sm:text-6xl text-white tracking-tight"
              >
                {slipAngle}°
              </motion.div>
              <div className="text-xs text-[#FF2A00] uppercase mt-1 font-bold flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#FF2A00]" />
                <span>HIGH-ANGLE OVERSTEER</span>
              </div>
              <div className="w-full h-2 bg-[#121214] rounded-full overflow-hidden mt-4">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#00FF66] via-yellow-400 to-[#FF2A00]" 
                  animate={{ width: `${(slipAngle / 65) * 100}%` }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                />
              </div>
            </div>

            <div className="flex justify-between text-xs pt-2 border-t border-[#18181b]">
              <span className="text-[#71717a]">STEERING COUNTER:</span>
              <span className="text-white font-bold">FULL OPPOSITE LOCK</span>
            </div>
          </motion.div>

          {/* Tile 3: 4-Wheel Tire Thermal Matrix */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ borderColor: 'rgba(255, 42, 0, 0.6)' }}
            className="bg-[#09090b] p-5 rounded border border-[#18181b] flex flex-col justify-between shadow-lg"
          >
            <div className="flex items-center justify-between text-xs text-[#71717a] mb-2">
              <span>TIRE CARTRIDGE MATRIX</span>
              <span className="text-white font-bold">4 CHANNELS</span>
            </div>

            {/* Car Chassis Wheel Layout */}
            <div className="grid grid-cols-2 gap-3 my-2">
              <div className="p-2.5 bg-[#121214] border border-[#27272a] rounded">
                <div className="text-[10px] text-[#71717a]">FRONT LEFT (FL)</div>
                <div className="text-sm font-bold text-white">82°C / 29.5 PSI</div>
                <div className="text-[10px] text-[#00FF66]">OPTIMAL GRIP</div>
              </div>
              <div className="p-2.5 bg-[#121214] border border-[#27272a] rounded">
                <div className="text-[10px] text-[#71717a]">FRONT RIGHT (FR)</div>
                <div className="text-sm font-bold text-white">86°C / 30.1 PSI</div>
                <div className="text-[10px] text-[#00FF66]">OPTIMAL GRIP</div>
              </div>
              <motion.div 
                animate={{ borderColor: ['rgba(255,42,0,0.4)', 'rgba(255,42,0,0.8)', 'rgba(255,42,0,0.4)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="p-2.5 bg-[#121214] border rounded"
              >
                <div className="text-[10px] text-[#FF2A00]">REAR LEFT (RL)</div>
                <div className="text-sm font-bold text-[#FF2A00]">104°C / 27.8 PSI</div>
                <div className="text-[10px] text-[#FF2A00] animate-pulse">HEAT WARNING</div>
              </motion.div>
              <motion.div 
                animate={{ borderColor: ['rgba(255,42,0,0.4)', 'rgba(255,42,0,0.8)', 'rgba(255,42,0,0.4)'] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="p-2.5 bg-[#121214] border rounded"
              >
                <div className="text-[10px] text-[#FF2A00]">REAR RIGHT (RR)</div>
                <div className="text-sm font-bold text-[#FF2A00]">108°C / 28.2 PSI</div>
                <div className="text-[10px] text-[#FF2A00] animate-pulse">HEAT WARNING</div>
              </motion.div>
            </div>

            <div className="flex justify-between text-xs pt-2 border-t border-[#18181b]">
              <span className="text-[#71717a]">COMPOUND:</span>
              <span className="text-white font-bold">COMPETITION SLICK</span>
            </div>
          </motion.div>

          {/* Tile 4: Powertrain & Velocity */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ borderColor: 'rgba(255, 42, 0, 0.6)' }}
            className="bg-[#09090b] p-5 rounded border border-[#18181b] flex flex-col justify-between shadow-lg"
          >
            <div className="flex items-center justify-between text-xs text-[#71717a] mb-2">
              <span>CAN VELOCITY BUS</span>
              <span className="text-[#00FF66] font-bold">ACTIVE</span>
            </div>

            <div className="space-y-3 my-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#71717a]">DRIFT SPEED:</span>
                  <span className="text-white font-bold">{speedMph} MPH</span>
                </div>
                <div className="w-full h-1.5 bg-[#121214] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white" 
                    animate={{ width: `${(speedMph / 140) * 100}%` }}
                    transition={{ ease: 'easeOut', duration: 0.2 }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#71717a]">THROTTLE POSITION:</span>
                  <span className="text-[#FF2A00] font-bold">{throttlePct}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#121214] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#FF2A00]" 
                    animate={{ width: `${throttlePct}%` }}
                    transition={{ ease: 'easeOut', duration: 0.2 }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#71717a]">TWIN TURBO BOOST:</span>
                  <span className="text-white font-bold">{boostBar} BAR</span>
                </div>
                <div className="w-full h-1.5 bg-[#121214] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#00FF66]" 
                    animate={{ width: `${(boostBar / 2.5) * 100}%` }}
                    transition={{ ease: 'easeOut', duration: 0.2 }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between text-xs pt-2 border-t border-[#18181b]">
              <span className="text-[#71717a]">EXHAUST VALVE:</span>
              <span className="text-[#FF2A00] font-bold">OPEN (STRAIGHT-PIPE)</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
