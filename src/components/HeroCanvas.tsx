import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { CanvasRenderMode } from '../types';
import { soundEngine } from '../utils/audio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Flame, 
  Layers, 
  Crosshair, 
  Eye, 
  Radio, 
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  MousePointer
} from 'lucide-react';

interface HeroCanvasProps {
  onAcquireClick: () => void;
  onExploreClick: () => void;
}

const TOTAL_FRAMES = 300;

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ onAcquireClick, onExploreClick }) => {
  const scrollSectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroContainerRef = useRef<HTMLDivElement | null>(null);

  // 300-frame sequence state (0 to 299)
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1); // 0.5, 1, 2
  const [direction, setDirection] = useState<1 | -1>(1);
  const [renderMode, setRenderMode] = useState<CanvasRenderMode>('standard');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartFrame, setDragStartFrame] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(soundEngine.getIsMuted());
  const [isRevving, setIsRevving] = useState<boolean>(false);
  const [hudCoordinates, setHudCoordinates] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [engineRpm, setEngineRpm] = useState<number>(920);
  const [scrollProgressPct, setScrollProgressPct] = useState<number>(0);

  // Image preloading & caching
  const imagesMapRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const [loadedCount, setLoadedCount] = useState<number>(0);

  // Smoke & flame particles
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
    life: number;
  }>>([]);

  const flamesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
  }>>([]);

  // Helper to format frame path
  const getFrameUrl = useCallback((index: number) => {
    const num = Math.min(300, Math.max(1, index + 1));
    const padded = String(num).padStart(3, '0');
    return `/frames/ezgif-frame-${padded}.jpg`;
  }, []);

  // Preload frames progressively
  useEffect(() => {
    let isCancelled = false;
    let loaded = 0;

    const loadSingleFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (imagesMapRef.current.has(index)) {
          resolve(imagesMapRef.current.get(index)!);
          return;
        }
        const img = new Image();
        img.src = getFrameUrl(index);
        img.onload = () => {
          if (!isCancelled) {
            imagesMapRef.current.set(index, img);
            loaded++;
            setLoadedCount(loaded);
          }
          resolve(img);
        };
        img.onerror = () => {
          resolve(img);
        };
      });
    };

    // Fast initial burst: load frame 0 and every 4th frame first
    const initialIndices: number[] = [0];
    for (let i = 1; i < TOTAL_FRAMES; i += 4) {
      initialIndices.push(i);
    }

    Promise.all(initialIndices.map(idx => loadSingleFrame(idx))).then(() => {
      if (isCancelled) return;

      // Then load remaining frames progressively in batches of 20
      const remaining: number[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!initialIndices.includes(i)) {
          remaining.push(i);
        }
      }

      const loadInBatches = async () => {
        const batchSize = 20;
        for (let i = 0; i < remaining.length; i += batchSize) {
          if (isCancelled) break;
          const chunk = remaining.slice(i, i + batchSize);
          await Promise.all(chunk.map(idx => loadSingleFrame(idx)));
          await new Promise(r => setTimeout(r, 16));
        }
      };

      loadInBatches();
    });

    return () => {
      isCancelled = true;
    };
  }, [getFrameUrl]);

  // VERTICAL SCROLL LISTENER: Scrubs through all 300 frames as user scrolls vertically down
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollSectionRef.current) return;
      const rect = scrollSectionRef.current.getBoundingClientRect();
      const totalScrollable = scrollSectionRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Distance scrolled down into this 320vh section
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      const pct = Math.round(progress * 100);
      setScrollProgressPct(pct);

      if (!isDraggingRef.current) {
        const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * (TOTAL_FRAMES - 1)));
        setCurrentFrame(targetFrame);
        if (isPlaying) {
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPlaying]);

  // Auto-play loop for 300-frame rotation
  useEffect(() => {
    if (!isPlaying || isDragging) return;

    const intervalMs = Math.round(1000 / (30 * playSpeed));
    const timer = setInterval(() => {
      setCurrentFrame(prev => {
        const next = prev + direction;
        if (next >= TOTAL_FRAMES) return 0;
        if (next < 0) return TOTAL_FRAMES - 1;
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playSpeed, direction, isDragging]);

  // Update engine RPM display
  useEffect(() => {
    const timer = setInterval(() => {
      setEngineRpm(soundEngine.getCurrentRpm());
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Mouse horizontal drag scrubbing handlers (allows tactile inspection anytime)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    setDragStartX(e.clientX);
    setDragStartFrame(currentFrame);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (heroContainerRef.current) {
      const rect = heroContainerRef.current.getBoundingClientRect();
      setHudCoordinates({
        x: Math.round(e.clientX - rect.left),
        y: Math.round(e.clientY - rect.top)
      });
    }

    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    // 600px drag = 300 frames
    const framesPerPixel = TOTAL_FRAMES / 600;
    const frameDelta = Math.round(deltaX * framesPerPixel);
    let newFrame = (dragStartFrame + frameDelta) % TOTAL_FRAMES;
    if (newFrame < 0) newFrame += TOTAL_FRAMES;
    setCurrentFrame(newFrame);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  // Touch handlers for mobile scrubbing
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      isDraggingRef.current = true;
      setDragStartX(e.touches[0].clientX);
      setDragStartFrame(currentFrame);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - dragStartX;
    const framesPerPixel = TOTAL_FRAMES / 400;
    const frameDelta = Math.round(deltaX * framesPerPixel);
    let newFrame = (dragStartFrame + frameDelta) % TOTAL_FRAMES;
    if (newFrame < 0) newFrame += TOTAL_FRAMES;
    setCurrentFrame(newFrame);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  // Throttle rev action
  const handleRevThrottle = () => {
    soundEngine.playClick(900);
    setIsRevving(true);
    soundEngine.revEngine(8800);

    // Spawn exhaust flame burst
    for (let i = 0; i < 28; i++) {
      flamesRef.current.push({
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: Math.random() * 14 + 6,
        life: 1.0
      });
    }

    // Spawn drift tire smoke
    for (let i = 0; i < 35; i++) {
      particlesRef.current.push({
        x: (Math.random() - 0.5) * 260,
        y: Math.random() * 40,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 2.5 - 0.5,
        size: Math.random() * 30 + 12,
        alpha: 0.75,
        color: '#71717a',
        life: 1.0
      });
    }

    setTimeout(() => {
      setIsRevving(false);
    }, 1200);
  };

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) {
      soundEngine.startEngine();
    }
  };

  // Helper to get closest loaded image if exact frame is buffering
  const getClosestLoadedImage = useCallback((target: number): HTMLImageElement | null => {
    if (imagesMapRef.current.has(target)) {
      return imagesMapRef.current.get(target)!;
    }
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const lower = (target - offset + TOTAL_FRAMES) % TOTAL_FRAMES;
      if (imagesMapRef.current.has(lower)) {
        return imagesMapRef.current.get(lower)!;
      }
      const upper = (target + offset) % TOTAL_FRAMES;
      if (imagesMapRef.current.has(upper)) {
        return imagesMapRef.current.get(upper)!;
      }
    }
    return null;
  }, []);

  // Canvas drawing loop (Frame as the true Hero Background)
  const renderFrame = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, frame: number) => {
    // 1. Clear background to pure nocturnal black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // 2. Studio calibration background grid
    ctx.save();
    ctx.strokeStyle = '#121214';
    ctx.lineWidth = 1;
    const gridSize = 45;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Render the vehicle frame as the HERO BACKGROUND
    const img = getClosestLoadedImage(frame);
    const imgAspect = (img && img.naturalWidth && img.naturalHeight) 
      ? img.naturalWidth / img.naturalHeight 
      : (16 / 9);

    // Full hero background cover calculation
    let renderW = width;
    let renderH = width / imgAspect;

    if (renderH < height) {
      renderH = height;
      renderW = height * imgAspect;
    }

    const renderX = (width - renderW) / 2;
    const renderY = (height - renderH) / 2;

    // Ground contact shadow & neon underglow directly on the background tarmac
    const groundY = renderY + renderH * 0.82;

    ctx.save();
    const underglowGrad = ctx.createRadialGradient(centerX, groundY, 20, centerX, groundY, renderW * 0.45);
    if (renderMode === 'flir') {
      underglowGrad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
      underglowGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.2)');
      underglowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (renderMode === 'wireframe') {
      underglowGrad.addColorStop(0, 'rgba(255, 42, 0, 0.25)');
      underglowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (renderMode === 'surveillance') {
      underglowGrad.addColorStop(0, 'rgba(0, 255, 102, 0.2)');
      underglowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      underglowGrad.addColorStop(0, 'rgba(255, 42, 0, 0.65)');
      underglowGrad.addColorStop(0.5, 'rgba(255, 42, 0, 0.2)');
      underglowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    ctx.fillStyle = underglowGrad;
    ctx.beginPath();
    ctx.ellipse(centerX, groundY, renderW * 0.42, renderH * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tire shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.beginPath();
    ctx.ellipse(centerX, groundY - 4, renderW * 0.38, renderH * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Draw Background Image Frame
    if (img && img.complete) {
      ctx.save();

      // Optical filters
      if (renderMode === 'wireframe') {
        ctx.filter = 'grayscale(100%) contrast(220%) brightness(110%)';
      } else if (renderMode === 'flir') {
        ctx.filter = 'contrast(200%) saturate(300%) hue-rotate(190deg) invert(15%)';
      } else if (renderMode === 'surveillance') {
        ctx.filter = 'grayscale(100%) sepia(100%) hue-rotate(80deg) saturate(280%) contrast(160%)';
      } else {
        ctx.filter = 'contrast(106%) saturate(104%)';
      }

      ctx.drawImage(img, renderX, renderY, renderW, renderH);
      ctx.restore();

      // 5. Special Mode CAD Overlays
      if (renderMode === 'wireframe') {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 42, 0, 0.6)';
        ctx.lineWidth = 1;

        // Bounding reticle
        ctx.strokeRect(centerX - renderW * 0.35, centerY - renderH * 0.3, renderW * 0.7, renderH * 0.6);

        // Center crosshair
        ctx.beginPath();
        ctx.moveTo(centerX - 24, centerY);
        ctx.lineTo(centerX + 24, centerY);
        ctx.moveTo(centerX, centerY - 24);
        ctx.lineTo(centerX, centerY + 24);
        ctx.stroke();

        ctx.fillStyle = '#FF2A00';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(`CHASSIS LENGTH: 4,572 MM`, centerX - renderW * 0.34, centerY - renderH * 0.24);
        ctx.fillText(`DOWNFORCE: 409 KG @ 200 KM/H`, centerX - renderW * 0.34, centerY - renderH * 0.2);
        ctx.fillText(`CAD VERTICES: 42,190`, centerX + renderW * 0.16, centerY - renderH * 0.24);
        ctx.restore();
      } else if (renderMode === 'flir') {
        ctx.save();
        ctx.fillStyle = '#FF2A00';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText('FLIR SENSOR OPTICS // 18°C — 890°C', 30, height - 70);

        const grad = ctx.createLinearGradient(30, height - 58, 180, height - 58);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(0.3, '#7c3aed');
        grad.addColorStop(0.6, '#ef4444');
        grad.addColorStop(1, '#fde047');
        ctx.fillStyle = grad;
        ctx.fillRect(30, height - 58, 150, 6);
        ctx.restore();
      } else if (renderMode === 'surveillance') {
        ctx.save();
        ctx.fillStyle = '#00FF66';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText('● REC [CAM_01 // ATELIER_TURNTABLE_BACKGROUND]', 30, 50);
        ctx.fillText(new Date().toISOString().replace('T', ' ').slice(0, 23), 30, 66);
        ctx.restore();
      }
    }

    // 6. Exhaust flame particles
    if (flamesRef.current.length > 0) {
      ctx.save();
      const exhaustX = centerX + renderW * 0.25;
      const exhaustY = groundY - renderH * 0.12;

      for (let i = flamesRef.current.length - 1; i >= 0; i--) {
        const f = flamesRef.current[i];
        f.x += f.vx;
        f.y += f.vy;
        f.life -= 0.04;
        f.size *= 0.94;

        if (f.life <= 0) {
          flamesRef.current.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(
          exhaustX + f.x,
          exhaustY + f.y,
          0,
          exhaustX + f.x,
          exhaustY + f.y,
          f.size
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, ' + f.life + ')');
        grad.addColorStop(0.3, 'rgba(255, 80, 0, ' + f.life * 0.9 + ')');
        grad.addColorStop(0.7, 'rgba(255, 0, 0, ' + f.life * 0.6 + ')');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(exhaustX + f.x, exhaustY + f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 7. Drift tire smoke particles
    if (particlesRef.current.length > 0) {
      ctx.save();
      const tireX = centerX;
      const tireY = groundY - 10;

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.size += 0.35;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(161, 161, 170, ${p.life * 0.25})`;
        ctx.beginPath();
        ctx.arc(tireX + p.x, tireY + p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 8. Cinematic Edge Vignette to frame the car background perfectly
    ctx.save();
    const vignette = ctx.createRadialGradient(centerX, centerY, width * 0.25, centerX, centerY, width * 0.7);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.45)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

  }, [renderMode, getClosestLoadedImage]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const render = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      renderFrame(ctx, width, height, currentFrame);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [renderFrame, currentFrame]);

  // Full-hero Canvas Resize handling
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !heroContainerRef.current) return;
      const rect = heroContainerRef.current.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      canvasRef.current.width = width * dpr;
      canvasRef.current.height = height * dpr;
      canvasRef.current.style.width = `${width}px`;
      canvasRef.current.style.height = `${height}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard Scrubbing Navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentFrame(prev => (prev - 1 + TOTAL_FRAMES) % TOTAL_FRAMES);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentFrame(prev => (prev + 1) % TOTAL_FRAMES);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const azimuthDegrees = Math.round((currentFrame / TOTAL_FRAMES) * 360);
  const bufferPct = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    /* OUTER SCROLL SECTION: 300vh height provides smooth vertical scroll track for the 300 frames */
    <section 
      ref={scrollSectionRef}
      id="hero-canvas-section" 
      className="relative w-full h-[320vh] bg-black"
    >
      {/* STICKY FULLSCREEN HERO VIEWPORT: Locks to screen while user scrolls vertically */}
      <div 
        ref={heroContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden bg-black select-none cursor-ew-resize transition-transform duration-75 ${
          isRevving ? 'animate-rev-shake' : ''
        }`}
      >
        {/* 1. THE 300-FRAME CANVAS AS THE TRUE HERO BACKGROUND */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none z-0"
        />

        {/* 2. Top & Bottom Atmospheric Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none z-10" />
        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none z-10" />

        {/* 3. Top Floating Navigation & HUD Controls */}
        <div className="relative z-20 w-full px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#18181b]/90 bg-black/60 backdrop-blur-md shrink-0">
          {/* Identifier Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-[#121214]/90 border border-[#27272a] rounded text-xs font-tech text-[#a1a1aa]">
              <span className="w-2 h-2 rounded-full bg-[#FF2A00] animate-pulse" />
              <span className="font-bold text-white">BACKGROUND 360° TURNTABLE</span>
              <span className="text-[#00FF66] font-bold hidden sm:inline">// VERTICAL SCROLL</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs font-tech text-[#71717a]">
              <span>BUFFER:</span>
              <span className="text-[#00FF66] font-bold">{bufferPct}% ({loadedCount}/{TOTAL_FRAMES})</span>
            </div>
          </div>

          {/* Multi-Spectral Sensor Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#121214]/90 p-0.5 rounded border border-[#27272a]">
            {(
              [
                { id: 'standard', label: 'STANDARD', icon: Eye },
                { id: 'wireframe', label: 'CAD WIRE', icon: Crosshair },
                { id: 'flir', label: 'FLIR THERMAL', icon: Layers },
                { id: 'surveillance', label: 'CCTV IR', icon: Radio }
              ] as const
            ).map((mode) => {
              const Icon = mode.icon;
              const isActive = renderMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEngine.playClick(1100);
                    setRenderMode(mode.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-tech transition-colors ${
                    isActive 
                      ? 'bg-[#FF2A00] text-black font-bold shadow-[0_0_12px_rgba(255,42,0,0.35)]' 
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                  }`}
                  title={mode.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{mode.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sound & Throttle Rev Controls */}
          <div className="flex items-center gap-2">
            <button
              id="btn-rev-exhaust"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRevThrottle();
              }}
              disabled={isRevving}
              className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-tech font-bold uppercase tracking-wider transition-all ${
                isRevving
                  ? 'bg-[#FF2A00] text-black border-[#FF2A00] shadow-[0_0_20px_#FF2A00] animate-pulse'
                  : 'bg-[#18181b]/90 hover:bg-[#27272a] text-[#FF2A00] border-[#FF2A00]/40'
              }`}
              title="Audition Exhaust Screamer Pipe (Web Audio)"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isRevving ? 'BURST!' : 'REV THROTTLE'}</span>
            </button>

            <button
              id="btn-mute-sound"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleSound();
              }}
              className="p-1 bg-[#18181b]/90 hover:bg-[#27272a] border border-[#27272a] rounded text-white transition-colors"
              title={isAudioMuted ? "Unmute Procedural Engine" : "Mute Engine Audio"}
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-[#71717a]" /> : <Volume2 className="w-3.5 h-3.5 text-[#FF2A00]" />}
            </button>
          </div>
        </div>

        {/* 4. Middle Floating Content & HUD Overlays */}
        <div className="relative z-20 flex-1 w-full flex items-center justify-between px-4 sm:px-8 pointer-events-none">
          {/* Left Floating Typography & CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-md space-y-2 pointer-events-auto bg-black/60 p-4 border border-[#18181b]/80 rounded backdrop-blur-md relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            {/* Top scanning laser edge */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF2A00] to-transparent animate-pulse opacity-75" />

            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FF2A00]/15 border border-[#FF2A00]/40 text-[#FF2A00] text-[10px] font-tech uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A00] animate-ping" />
              <span>ATELIER SPEC 01 // 300-FRAME ROTATION</span>
            </div>

            <motion.h1 
              animate={{ 
                textShadow: isRevving 
                  ? '0 0 20px rgba(255, 42, 0, 0.9), 0 0 40px rgba(255, 42, 0, 0.6)' 
                  : '0 0 0px rgba(0,0,0,0)' 
              }}
              className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight text-white leading-none"
            >
              PORSCHE <span className="text-[#FF2A00]">GT3 RS</span>
            </motion.h1>

            <p className="font-tech text-xs text-[#d4d4d8] tracking-wide leading-relaxed">
              STAGE-III CLUBSPORT // 525 BHP // 9,000 RPM. SCROLL VERTICALLY DOWN TO ROTATE 360° OR DRAG HORIZONTALLY TO INSPECT.
            </p>

            <div className="pt-2 flex items-center gap-2.5">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255, 42, 0, 0.6)' }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAcquireClick();
                }}
                className="px-4 py-2 bg-[#FF2A00] hover:bg-[#e02600] text-black font-tech font-bold text-xs uppercase tracking-wider rounded transition-transform shadow-[0_0_16px_rgba(255,42,0,0.35)]"
              >
                ACQUIRE // $389K
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, borderColor: '#FF2A00' }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExploreClick();
                }}
                className="px-3.5 py-2 bg-[#121214]/90 hover:bg-[#18181b] text-white border border-[#27272a] font-tech text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
              >
                <span>INVENTORY</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#FF2A00] animate-bounce" />
              </motion.button>
            </div>
          </motion.div>

          {/* Right Floating Diagnostics HUD */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="hidden sm:block text-right font-tech text-xs space-y-1.5 bg-black/80 p-3.5 border border-[#18181b] rounded backdrop-blur-md pointer-events-auto relative shadow-[0_0_25px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center justify-end gap-2 text-[#71717a]">
              <span>FRAME</span>
              <span className="text-white font-bold">[{String(currentFrame + 1).padStart(3, '0')} / {TOTAL_FRAMES}]</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-[#71717a]">
              <span>AZIMUTH</span>
              <span className="text-[#FF2A00] font-bold">[{azimuthDegrees}°]</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-[#71717a]">
              <span>ENGINE</span>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold">[{engineRpm} RPM]</span>
                {/* Audio-reactive RPM Equalizer bars */}
                <div className="flex items-end gap-0.5 h-3.5">
                  {[0.4, 0.8, 0.6, 1.0, 0.5, 0.9].map((scale, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isRevving ? ['4px', '14px', '8px', '14px'] : [`${scale * 6}px`, `${scale * 10}px`, `${scale * 5}px`]
                      }}
                      transition={{
                        duration: isRevving ? 0.12 : 0.4 + i * 0.1,
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                      className="w-0.5 bg-[#FF2A00] rounded-t"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 text-[#71717a]">
              <span>AXIS</span>
              <span className="text-[#00FF66] font-bold">[VERTICAL SCROLL]</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-[#71717a]">
              <span>SCROLL</span>
              <span className="text-[#FF2A00] font-bold">[{scrollProgressPct}%]</span>
            </div>
            <div className="text-[10px] text-[#52525b] pt-1 border-t border-[#18181b] flex items-center justify-end gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
              <span>CURSOR: X_{hudCoordinates.x} Y_{hudCoordinates.y}</span>
            </div>
          </motion.div>
        </div>

        {/* 5. Bottom Controls & Vertical Scroll Progress Bar */}
        <div 
          className="relative z-20 w-full px-4 sm:px-6 py-3 bg-black/90 border-t border-[#18181b] flex flex-col gap-2 shrink-0 backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Controls Header */}
          <div className="flex items-center justify-between gap-3 text-xs font-tech">
            {/* Left Playback & Step Buttons */}
            <div className="flex items-center gap-2">
              <button
                id="btn-prev-frame"
                type="button"
                onClick={() => {
                  soundEngine.playClick(900);
                  setCurrentFrame(prev => (prev - 1 + TOTAL_FRAMES) % TOTAL_FRAMES);
                }}
                className="p-1.5 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] rounded text-[#a1a1aa] hover:text-white transition-colors"
                title="Step Back (-1 Frame)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                id="btn-scrub-play-pause"
                type="button"
                onClick={() => {
                  soundEngine.playClick(1000);
                  setIsPlaying(!isPlaying);
                }}
                className="p-1.5 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] rounded text-white transition-colors"
                title={isPlaying ? "Pause Rotation" : "Auto-Orbit Rotation"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#FF2A00]" /> : <Play className="w-3.5 h-3.5 text-white" />}
              </button>

              <button
                id="btn-next-frame"
                type="button"
                onClick={() => {
                  soundEngine.playClick(950);
                  setCurrentFrame(prev => (prev + 1) % TOTAL_FRAMES);
                }}
                className="p-1.5 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] rounded text-[#a1a1aa] hover:text-white transition-colors"
                title="Step Forward (+1 Frame)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="btn-scrub-reverse"
                type="button"
                onClick={() => {
                  soundEngine.playClick(950);
                  setDirection(prev => (prev === 1 ? -1 : 1));
                }}
                className="p-1.5 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] rounded text-[#a1a1aa] hover:text-white transition-colors"
                title="Reverse Direction"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Speed Multipliers */}
              <div className="flex items-center bg-[#121214] border border-[#27272a] rounded p-0.5 text-xs font-tech">
                {[0.5, 1, 2].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(1100);
                      setPlaySpeed(spd);
                    }}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      playSpeed === spd ? 'bg-[#27272a] text-[#FF2A00] font-bold' : 'text-[#71717a] hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Center Callout: Scroll Vertically Downward Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-[#121214] border border-[#27272a] rounded-full text-[11px] text-[#a1a1aa]">
              <ArrowDown className="w-3 h-3 text-[#FF2A00] animate-bounce" />
              <span className="font-tech uppercase tracking-wider text-white">
                SCROLL VERTICALLY TO ROTATE 360°
              </span>
              <span className="hidden md:inline text-[#71717a]">// DRAG TO INSPECT</span>
            </div>

            {/* Right Frame Counter & Scroll Progress */}
            <div className="flex items-center gap-2">
              <span className="text-[#71717a] hidden sm:inline">FRAME:</span>
              <span className="px-2.5 py-0.5 bg-[#18181b] border border-[#27272a] text-[#FF2A00] font-bold rounded">
                {String(currentFrame + 1).padStart(3, '0')} / {TOTAL_FRAMES}
              </span>
              <span className="text-white font-bold hidden sm:inline">({azimuthDegrees}°)</span>
            </div>
          </div>

          {/* Vertical Scroll Progress Bar & Needle Display */}
          <div className="relative w-full h-3 bg-[#121214] border border-[#27272a] rounded overflow-hidden flex items-center">
            {/* Background Frame Tick Marks */}
            <div className="w-full flex justify-between pointer-events-none opacity-30 px-1">
              {Array.from({ length: 60 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-0.5 ${i % 5 === 0 ? 'h-2 bg-white' : 'h-1 bg-[#71717a]'}`} 
                />
              ))}
            </div>

            {/* Filled Progress Bar */}
            <div 
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#FF2A00]/40 to-[#FF2A00] pointer-events-none transition-all duration-75"
              style={{
                width: `${((currentFrame + 1) / TOTAL_FRAMES) * 100}%`
              }}
            />

            {/* Needle indicator */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_#ffffff] pointer-events-none transition-all duration-75"
              style={{
                left: `${((currentFrame + 1) / TOTAL_FRAMES) * 100}%`
              }}
            />
          </div>

          {/* Quick Range Slider as Direct Scrubbing Method */}
          <div className="relative w-full flex items-center">
            <input
              id="frame-scrubber-slider"
              type="range"
              min="0"
              max={TOTAL_FRAMES - 1}
              value={currentFrame}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setCurrentFrame(val);
                soundEngine.playClick(800 + (val % 30) * 12, 0.01);
              }}
              className="w-full h-1.5 bg-[#18181b] rounded-lg appearance-none cursor-pointer accent-[#FF2A00] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
