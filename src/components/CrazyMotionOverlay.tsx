import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface CrazyMotionOverlayProps {
  isRevving?: boolean;
}

export const CrazyMotionOverlay: React.FC<CrazyMotionOverlayProps> = ({ isRevving = false }) => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [shockwaves, setShockwaves] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const shockwaveIdRef = useRef(0);

  // Smooth springs for mouse reticle
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { stiffness: 400, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 28 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setMousePos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = target.closest('button, a, input, [role="button"], canvas') !== null;
        setIsHoveringClickable(isClickable);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const id = ++shockwaveIdRef.current;
      setShockwaves(prev => [...prev.slice(-4), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setShockwaves(prev => prev.filter(s => s.id !== id));
      }, 900);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [mouseX, mouseY]);

  // Trigger screen-wide shockwave on rev burst
  useEffect(() => {
    if (isRevving) {
      const id = ++shockwaveIdRef.current;
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      setShockwaves(prev => [...prev, { id, x, y }]);
      setTimeout(() => {
        setShockwaves(prev => prev.filter(s => s.id !== id));
      }, 1000);
    }
  }, [isRevving]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* 1. Interactive HUD Crosshair / Laser Reticle that follows cursor */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        className="hidden md:flex items-center justify-center absolute pointer-events-none"
      >
        {/* Outer targeting bracket */}
        <motion.div
          animate={{
            scale: isHoveringClickable ? 1.4 : 1,
            rotate: isHoveringClickable ? 45 : 0,
            borderColor: isHoveringClickable ? '#FF2A00' : 'rgba(255, 42, 0, 0.45)'
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="w-8 h-8 rounded-full border border-dashed border-[#FF2A00]/50 flex items-center justify-center"
        >
          {/* Inner laser pip */}
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF2A00] shadow-[0_0_8px_#FF2A00]" />
        </motion.div>

        {/* Micro coordinate readout floating beside reticle */}
        <div className="absolute left-6 -top-3 font-tech text-[9px] text-[#FF2A00]/70 tracking-widest whitespace-nowrap">
          {mousePos.x > 0 ? `X:${mousePos.x} Y:${mousePos.y}` : ''}
        </div>
      </motion.div>

      {/* 2. Click & Rev Shockwave Ripples */}
      {shockwaves.map((sw) => (
        <motion.div
          key={sw.id}
          initial={{ scale: 0.1, opacity: 0.8, borderWidth: 3 }}
          animate={{ scale: 4.5, opacity: 0, borderWidth: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          style={{ left: sw.x, top: sw.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[#FF2A00] shadow-[0_0_30px_#FF2A00] pointer-events-none"
        />
      ))}

      {/* 3. Screen Flash & Distortion Overlay during Nitro Rev */}
      {isRevving && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.6, 0.1, 0.4, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="absolute inset-0 bg-[#FF2A00]/15 mix-blend-screen pointer-events-none"
        />
      )}

      {/* 4. Ambient Scanning Laser Ray */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FF2A00]/60 to-transparent shadow-[0_0_15px_#FF2A00] animate-laser pointer-events-none opacity-40" />
    </div>
  );
};
